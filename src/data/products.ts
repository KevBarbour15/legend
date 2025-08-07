export interface ProductContentProps {
  product: {
    id: string;
    title: string;
    description: string;
    descriptionHtml: string;
    handle: string;
    images: { nodes: { url: string; altText: string | null }[] };
    variants: {
      nodes: {
        id: string;
        title: string;
        availableForSale: boolean;
        quantityAvailable: number;
        price: { amount: string; currencyCode: string };
        selectedOptions: { name: string; value: string }[];
      }[];
    };
  };
}
