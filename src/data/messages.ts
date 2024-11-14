export interface Message {
  _id: string;
  formType: string;
  name: string;
  email: string;
  phone: string;
  eventDate?: Date;
  eventTime?: string;
  eventType?: string;
  guests?: number;
  musicType?: string;
  sentAt: Date;
  message: string;
  read: boolean;
  contacted: boolean;
}

export interface MessageCardProps {
  message: Message;
  fetchMessages: () => void;
  index: number;
}

export interface DeleteMessageDialogProps {
  openDeleteModal: boolean;
  fetchMessages: () => void;
  closeDeleteModal: () => void;
  message: {
    _id: string;
  };
}
