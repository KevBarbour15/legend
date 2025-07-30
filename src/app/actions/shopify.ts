import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(
  "https://legendhasithifi.myshopify.com/api/2023-10/graphql.json",
  {
    headers: {
      "X-Shopify-Storefront-Access-Token":
        process.env.SHOPIFY_STOREFRONT_TOKEN!,
      "Content-Type": "application/json",
    },
  },
);

export async function getAllProductsWithVariants() {
  const query = `
    query GetProductsWithVariants($first: Int!) {
      products(first: $first) {
        nodes {
          id
          title
          description
          images(first: 5) {
            nodes {
              url
              altText
            }
          }
          variants(first: 20) {
            nodes {
              id
              title
              sku
              availableForSale
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  const variables = { first: 50 };
  return client.request(query, variables);
}
