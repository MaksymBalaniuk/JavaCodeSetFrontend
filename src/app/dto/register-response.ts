export interface RegisterResponse {
  existByUsername: boolean;
  existByEmail: boolean;
  token: string;
  id: string;
}
