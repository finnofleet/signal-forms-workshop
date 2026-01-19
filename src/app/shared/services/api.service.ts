import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CheckUsernameResponse,
  CheckEmailResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  User,
  DiscountValidationRequest,
  DiscountValidationResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  Country,
  Product
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://signal-forms-workshop-api.matestefanczyk.workers.dev';

  // ============================================
  // Auth Endpoints
  // ============================================

  checkUsername(username: string): Observable<CheckUsernameResponse> {
    return this.http.get<CheckUsernameResponse>(
      `${this.baseUrl}/api/auth/check-username?username=${encodeURIComponent(username)}`
    );
  }

  checkEmail(email: string): Observable<CheckEmailResponse> {
    return this.http.get<CheckEmailResponse>(
      `${this.baseUrl}/api/auth/check-email?email=${encodeURIComponent(email)}`
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/api/auth/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/auth/login`, data);
  }

  // ============================================
  // User Endpoints
  // ============================================

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/api/users/${id}`);
  }

  updateUser(id: string, data: Partial<User>): Observable<{ success: boolean; user?: User; errors?: any[] }> {
    return this.http.put<{ success: boolean; user?: User; errors?: any[] }>(
      `${this.baseUrl}/api/users/${id}`,
      data
    );
  }

  // ============================================
  // Order Endpoints
  // ============================================

  validateDiscount(code: string): Observable<DiscountValidationResponse> {
    return this.http.post<DiscountValidationResponse>(
      `${this.baseUrl}/api/orders/validate-discount`,
      { code }
    );
  }

  createOrder(order: CreateOrderRequest): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(`${this.baseUrl}/api/orders`, order);
  }

  // ============================================
  // Utility Endpoints
  // ============================================

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}/api/countries`);
  }

  getCities(countryCode: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/api/cities?country=${countryCode}`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/api/products`);
  }
}
