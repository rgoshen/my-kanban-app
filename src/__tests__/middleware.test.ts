import { NextRequest } from "next/server";

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    next: jest.fn(() => ({
      headers: {
        set: jest.fn(),
      },
    })),
  },
}));

import { middleware } from "../middleware";

describe("Middleware", () => {
  let mockRequest: NextRequest;
  let mockResponse: any;
  const { NextResponse } = require("next/server");

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      url: "http://localhost:3000/test",
      nextUrl: {
        pathname: "/test",
      },
    } as any;

    mockResponse = {
      headers: {
        set: jest.fn(),
      },
    };

    NextResponse.next.mockReturnValue(mockResponse);
  });

  it("should add security headers to the response", () => {
    middleware(mockRequest);

    expect(mockResponse.headers.set).toHaveBeenCalledWith("X-Frame-Options", "DENY");
    expect(mockResponse.headers.set).toHaveBeenCalledWith("X-Content-Type-Options", "nosniff");
    expect(mockResponse.headers.set).toHaveBeenCalledWith(
      "Referrer-Policy",
      "strict-origin-when-cross-origin",
    );
    expect(mockResponse.headers.set).toHaveBeenCalledWith("X-XSS-Protection", "1; mode=block");
    expect(mockResponse.headers.set).toHaveBeenCalledWith(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );
    expect(mockResponse.headers.set).toHaveBeenCalledWith(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  });

  it("should call NextResponse.next()", () => {
    middleware(mockRequest);
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it("should return the response with headers", () => {
    const result = middleware(mockRequest);
    expect(result).toBe(mockResponse);
  });

  it("should handle different request URLs", () => {
    const requests = [
      { url: "http://localhost:3000/", nextUrl: { pathname: "/" } },
      { url: "http://localhost:3000/api/test", nextUrl: { pathname: "/api/test" } },
      { url: "http://localhost:3000/dashboard", nextUrl: { pathname: "/dashboard" } },
    ];

    requests.forEach((req) => {
      const mockReq = { ...req } as any;
      middleware(mockReq);
      expect(mockResponse.headers.set).toHaveBeenCalledWith("X-Frame-Options", "DENY");
    });
  });
});
