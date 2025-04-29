export interface SignupPayload {
  email: string;
  password: string
}

export interface SignupResponse {
  token: string;
  user: {
    email: string;
  };
}

export interface PasswordErr {
  minLength: boolean;
  containsUppercase: boolean;
  containsLowercase: boolean;
  containsNumber: boolean;
  containsSpecialChar: boolean;
}

export interface Brewery {
  id: string
  name: string
  brewery_type: string
  address_1: string | null
  address_2: string | null
  address_3: string | null
  city: string
  state_province: string
  postal_code: string
  country: string
  longitude: number | null
  latitude: number | null
  phone: string
  website_url: string| null
  state: string
  street: string
}

export type columnType ={
  key: string;
  label: string;
}
export type BreweryType = {
  id: string;
  name: string;
  country: string;
  city: string;
  state?: string;
};