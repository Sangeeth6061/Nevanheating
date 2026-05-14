const NEXT_PUBLIC_WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function fetchPosts() {
  if (!NEXT_PUBLIC_WORDPRESS_URL) {
    console.warn("NEXT_PUBLIC_WORDPRESS_URL is not defined in .env.local");
    return [];
  }

  try {
    const res = await fetch(`${NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts?_embed`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching WordPress posts:", error);
    return [];
  }
}

export async function fetchServices() {
  if (!NEXT_PUBLIC_WORDPRESS_URL) {
    console.warn("NEXT_PUBLIC_WORDPRESS_URL is not defined in .env.local");
    return [];
  }

  try {
    const res = await fetch(`${NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/service?_embed`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch services: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching WordPress services:", error);
    return [];
  }
}

export async function fetchHomePage() {
  if (!NEXT_PUBLIC_WORDPRESS_URL) {
    return [];
  }

  try {
    const res = await fetch(`${NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/pages?slug=home&_embed`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch home page: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching WordPress home page:", error);
    return [];
  }
}

export async function fetchHeader() {
  if (!NEXT_PUBLIC_WORDPRESS_URL) {
    return null;
  }

  try {
    const res = await fetch(`${NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/header?_embed`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch header: ${res.statusText}`);
    }

    const data = await res.json();
    // Assuming the header we want is the first one or we can search by a specific slug, 
    // but the endpoint returns an array. Let's return the first item's ACF fields.
    return data?.[0]?.acf || null;
  } catch (error) {
    console.error("Error fetching WordPress header:", error);
    return null;
  }
}
