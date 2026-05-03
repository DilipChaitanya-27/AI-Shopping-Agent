const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || "2024-01";

const SHOPIFY_GRAPHQL_URL = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          productType
          tags
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;
function mapCategory(productType, title, tags = []) {
  const text = `${productType} ${title} ${tags.join(" ")}`.toLowerCase();

  if (/(skin|face|serum|cleanser|moisturizer|sunscreen)/.test(text)) return "skincare";
  if (/(headphone|earphone|earbud|audio|wired|over ear)/.test(text)) return "audio";
  if (/(snowboard|snow)/.test(text)) return "snowboards";
  if (/(gift)/.test(text)) return "gift";

  return "other";
}
function extractProducts(data) {
  const edges = data?.data?.products?.edges || [];
  return edges.map((edge, index) => {
    const node = edge.node;
    const variant = node.variants?.edges?.[0]?.node;
    const image = node.images?.edges?.[0]?.node;

    const priceAmount = variant?.price?.amount;
    const price = priceAmount ? Math.round(parseFloat(priceAmount)) : 0;

    return {
  id: node.id.split("/").pop() || String(index),
  name: node.title,
  description: node.description,
  price: price,
  rating: 4.2,

  // 🔥 FORCE IMAGE
  image: image?.url
    ? image.url
    : "https://via.placeholder.com/300x300?text=No+Image",

  category: node.productType?.toLowerCase() || "general",
  skin: "all",
  features: node.tags?.slice(0, 5) || [],
};
  });
}

export async function fetchShopifyProducts(limit = 50) {
  if (!STORE_DOMAIN || !ACCESS_TOKEN) {
    console.warn("Shopify credentials missing — returning empty array");
    return [];
  }

  try {
    const res = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: { first: limit },
      }),
    });

    if (!res.ok) {
      throw new Error(`Shopify HTTP error: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
      console.error("Shopify GraphQL errors:", json.errors);
      return [];
    }

    return extractProducts(json);
  } catch (err) {
    console.error("Failed to fetch Shopify products:", err);
    return [];
  }
}

