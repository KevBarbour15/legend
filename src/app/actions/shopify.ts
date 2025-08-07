import { GraphQLClient } from "graphql-request";
import { unstable_noStore } from "next/cache";

// Disable caching for Shopify API calls
export const revalidate = 0;

const client = new GraphQLClient(
  "https://legendhasithifi.myshopify.com/api/2025-07/graphql.json",
  {
    headers: {
      "X-Shopify-Storefront-Access-Token":
        process.env.SHOPIFY_STOREFRONT_TOKEN!,
      "Content-Type": "application/json",
    },
  },
);

export async function getAllProductsWithVariants() {
  unstable_noStore();
  const query = `
    query GetProductsWithVariants($first: Int!) {
      products(first: $first) {
        nodes {
          id
          title
          description
          descriptionHtml
          handle
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

export async function getProductByHandle(handle: string) {
  unstable_noStore();
  const query = `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        descriptionHtml
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
  `;
  const variables = { handle };
  const data = await client.request(query, variables);
  return data?.productByHandle || null;
}

export async function getVariantsInventory(variantIds: string[]) {
  unstable_noStore();
  const query = `
    query GetVariantsInventory($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on ProductVariant {
          id
          availableForSale
          quantityAvailable
        }
      }
    }
  `;
  const variables = { ids: variantIds };
  const data = await client.request(query, variables);
  return data?.nodes || [];
}
