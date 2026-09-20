const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5100/api";

const request = async (endpoint, options = {}) => {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};

export const registerUser = async (userData) => {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (credentials) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const getCurrentUser = async (token) => {
  return request("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCourses = async () => {
  return request("/courses");
};

export const getCourseById = async (courseId) => {
  return request(`/courses/${courseId}`);
};

export const enrollInCourse = async (
  courseId,
  token
) => {
  return request(
    `/courses/${courseId}/enroll`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getMyCourses = async (token) => {
  return request("/users/me/courses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCourseProgress = async (
  courseId,
  progress,
  token
) => {
  return request(
    `/courses/${courseId}/progress`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        progress,
      }),
    }
  );
};

