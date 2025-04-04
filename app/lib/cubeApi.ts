// utils/cubeApi.js

export const CUBEJS_BASE_URL =
  "https://amaranth-muskox.aws-us-east-1.cubecloudapp.dev/dev-mode/feat/frontend-hiring-task/cubejs-api/v1/load";

export const CUBEJS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJicmFuZElkIjoiNDkiLCJleHAiOjE3NDM0OTYyMTIsImlzcyI6ImN1YmVjbG91ZCJ9.luqfkt0CQW_B01j5oAvl_8hicbFzPmyLXfvEZYJbej4";

export const fetchCubeData = async (query:any) => {
    const url = CUBEJS_BASE_URL
      || "https://amaranth-muskox.aws-us-east-1.cubecloudapp.dev/dev-mode/feat/frontend-hiring-task/cubejs-api/v1/load";
  
    const token = CUBEJS_TOKEN
      || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJicmFuZElkIjoiNDkiLCJleHAiOjE3NDM0OTYyMTIsImlzcyI6ImN1YmVjbG91ZCJ9.luqfkt0CQW_B01j5oAvl_8hicbFzPmyLXfvEZYJbej4";
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          queryType: 'multi',  // Use 'multi' if your query is an object. 
                               // If you pass an array of queries, it will return results[ ].
        }),
      });
  
      const data = await response.json();
      return data; // data.results[0], data.results[1], etc.
    } catch (error) {
      console.error("Cube.js fetch error:", error);
      throw error;
    }
  };
  