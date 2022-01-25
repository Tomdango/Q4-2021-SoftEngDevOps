const BASE_API_ROUTE = "";

interface PerformFetchConfig extends RequestInit {
  sendToken?: boolean;
  expectedStatusCodes: Array<number>;
}

const getAuthToken = () => localStorage.getItem("authToken");

const performFetch = async (url: string, config: PerformFetchConfig) => {
  if (config.sendToken ?? true) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    };
  }

  const response = await fetch(`${BASE_API_ROUTE}${url}`, config);

  if (!config.expectedStatusCodes.includes(response.status)) {
    throw new Error(
      `Unexpected status code: ${response.status} ${response.statusText}`
    );
  }

  return response;
};

/**
 * POST /api/auth/login
 */
export const login = async (username: string, password: string) => {
  const response = await performFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    expectedStatusCodes: [200, 401],
  });

  if (response.status === 401) {
    return { success: false, user: null, token: null };
  }

  if (response.status === 200) {
    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    return {
      success: true,
      user: data.user,
      token: data.token,
    };
  }

  throw new Error("Unexpected Status Code");
};

/**
 * GET /api/auth/refresh
 */
export const refresh = async () => {
  const response = await performFetch("/api/auth/refresh", {
    expectedStatusCodes: [200, 401],
  });

  if (response.status === 200) {
    return {
      success: true,
      user: await response.json(),
    };
  }

  if (response.status === 401) {
    return {
      success: false,
      user: null,
    };
  }

  throw new Error("Unexpected Status Code");
};

/**
 * GET /api/bookings/current-user
 */
export const getBookingsForCurrentUser = async () => {
  const response = await performFetch("/api/bookings/current-user", {
    expectedStatusCodes: [200],
  });

  return response.json();
};

/**
 * GET /api/rooms
 */
export const getAllRooms = async () => {
  const response = await performFetch("/api/rooms/", {
    expectedStatusCodes: [200],
  });

  return response.json();
};

/**
 * POST /api/rooms/create
 */
export const createRoom = async (data: any) => {
  const response = await performFetch("/api/rooms/create", {
    method: "POST",
    body: JSON.stringify(data),
    expectedStatusCodes: [200, 400],
  });

  return response.json();
};

/**
 * GET /api/rooms/:roomID
 */
export const getRoomByID = async (roomID: string) => {
  const response = await performFetch(`/api/rooms/${roomID}`, {
    expectedStatusCodes: [200],
  });

  return response.json();
};

/**
 * GET /api/rooms/:roomID/bookings
 */
export const getBookingsByRoomID = async (roomID: string) => {
  const response = await performFetch(`/api/rooms/${roomID}/bookings`, {
    expectedStatusCodes: [200],
  });

  return response.json();
};

export const bookRoom = async (
  roomID: string,
  startTime: Date,
  endTime: Date,
  note: string
) => {
  const response = await performFetch(`/api/rooms/${roomID}/book`, {
    method: "POST",
    body: JSON.stringify({
      note,
      time_from: Math.floor(startTime.getTime() / 1000),
      time_to: Math.floor(endTime.getTime() / 1000),
    }),
    expectedStatusCodes: [200],
  });

  console.log(await response.json());
};
