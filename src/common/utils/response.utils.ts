export interface AuthResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export class RegisterResponse<T = any> {
  static success<T>(message = 'Success', data?: T): AuthResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message = 'Error', data?: any): AuthResponse {
    return {
      success: false,
      message,
      data,
    };
  }
}

export class LoginResponse<T = any> {
  static success<T>(
    message = 'Success',
    token: string,
    data?: T,
  ): AuthResponse<T> {
    return {
      success: true,
      message,
      token,
      data,
    };
  }

  static error(message = 'Error', data?: any): AuthResponse {
    return {
      success: false,
      message,
      data,
    };
  }
}

export class ResponseUtil {
  static success<T>(message = 'Success', data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message = 'Error', data?: any): ApiResponse {
    return {
      success: false,
      message,
      data,
    };
  }
}
