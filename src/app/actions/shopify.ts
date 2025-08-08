import { GraphQLClient } from "graphql-request";
import { unstable_noStore } from "next/cache";

// Disable caching for Shopify API calls
export const revalidate = 0;

// Types for GraphQL responses
type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

type UserError = {
  field?: string[] | null;
  message: string;
};

type CreateCartResponse = {
  cartCreate?: {
    cart?: {
      id: string;
      checkoutUrl: string;
    } | null;
    userErrors?: UserError[];
  } | null;
};

type ProductImage = {
  url: string;
  altText: string | null;
};

type SelectedOption = {
  name: string;
  value: string;
};

type ProductVariant = {
  id: string;
  title: string;
  sku?: string | null;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: ShopifyMoney;
  selectedOptions: SelectedOption[];
};

type Product = {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  images: { nodes: ProductImage[] };
  variants: { nodes: ProductVariant[] };
};

type GetProductByHandleResponse = {
  productByHandle: Product | null;
};

type GetVariantsInventoryResponse = {
  nodes: Array<{
    id: string;
    availableForSale: boolean;
    quantityAvailable?: number | null;
  } | null>;
};

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

export async function createCartAndGetCheckoutUrl(
  items: Array<{ merchandiseId: string; quantity: number }>,
) {
  unstable_noStore();
  const mutation = `
    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lines: items.map((item) => ({
        merchandiseId: item.merchandiseId,
        quantity: item.quantity,
      })),
    },
  } as any;

  const data = await client.request<CreateCartResponse>(mutation, variables);
  const errors = data?.cartCreate?.userErrors;
  if (errors && errors.length) {
    throw new Error(errors.map((e: any) => e.message).join(", "));
  }
  return data?.cartCreate?.cart?.checkoutUrl as string | undefined;
}

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
              quantityAvailable
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
            quantityAvailable
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
  const data = await client.request<GetProductByHandleResponse>(
    query,
    variables,
  );
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
  const data = await client.request<GetVariantsInventoryResponse>(
    query,
    variables,
  );
  return data?.nodes || [];
}
