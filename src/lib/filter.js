export function filterProducts(products, intent) {
  return products.filter(p =>
    (!intent.skin || p.skin === intent.skin) &&
    (!intent.budget || p.price <= intent.budget)
  );
}