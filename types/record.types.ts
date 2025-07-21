export interface Record {
  id: string;
  user_id: string;
  data: JsonData;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface JsonData {
  [key: string]: any;
}

export interface CreateRecordDTO {
  data: JsonData;
  is_public: boolean;
}
