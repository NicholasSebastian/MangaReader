import axios, { AxiosRequestConfig } from "axios";

const SOURCE_URL = "https://graphql.anilist.co";
const BATCH_SIZE = 50;

type Callback = (collection: Array<any>) => void | Promise<void>

export async function getListing(limit: number, callback: Callback) {
  let hasNextPage = true;
  let hasRemaining = true;
  let withinLimit = true;

  for (let page = 1; hasNextPage && hasRemaining && withinLimit; page++) {
    try {
      // Fetch data in batches, format, then pass to the callback.
      const variables = { page, perPage: BATCH_SIZE };
      const response = await axios.post(SOURCE_URL, { query, variables }, requestConfig);
      const body = response.data as any;
  
      const { pageInfo, media: data } = body.data.Page;
      const remaining = response.headers["x-ratelimit-remaining"];
  
      const manga = data.map(format);
      await callback(manga);
  
      // Check for conditions.
      hasNextPage = pageInfo.hasNextPage;
      hasRemaining = parseInt(remaining) > 0;
      withinLimit = ((page + 1) * BATCH_SIZE) < limit;
    }
    catch(e) { 
      console.warn(e); 
      continue;
    }
  }

  // Return the textual description as to how the function finished execution.
  if (!hasNextPage) return "hasNextPage: false";
  if (!hasRemaining) return "hasRemaining: false";
  if (!withinLimit) return "withinLimit: false";
  return "unexpected end";
}

// Simplify deep nested data structures.
function format(data: any) {
  try {
    data.coverImage = data.coverImage ? data.coverImage.large : undefined;

    const firstStaff = data.author?.edges[0];
    data.author = firstStaff ? firstStaff.node.name.full : undefined;

    data.relations = data.relations?.edges
      .filter((m: any) => m.node?.type === "MANGA")
      .map((m: any) => m.node.id);

    data.recommendations = data.recommendations?.edges
      .filter((m: any) => m.node?.mediaRecommendation?.type === "MANGA")
      .map((m: any) => m.node.mediaRecommendation.id);
  }
  catch (e) { 
    console.warn(e); 
  }
  return data;
}

const requestConfig: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

const query = `
  query ($id: Int, $page: Int, $perPage: Int, $search: String) {  
    Page (page: $page, perPage: $perPage) {    
      pageInfo {       
        hasNextPage     
      }    
      media (id: $id, search: $search, type: MANGA, sort: POPULARITY_DESC) {      
        id      
        title {      
          english
          romaji 
          native
        }    
        description
        status
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        coverImage {
          large
        }
        genres
        synonyms
        averageScore
        popularity
        trending
        favourites
        isAdult
        author: staff (perPage: 1) {
          edges {
            node {
              name {
                full
              }
            }
          }
        }
        externalLinks {
          url
          site
        }
        relations {
          edges {
            node {
              id
              type
            }
          }
        }
        recommendations (perPage: 8) {
          edges {
            node {
              mediaRecommendation {
                id
                type
              }
            }
          }
        }
      }  
    }
  }
`;