
import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "AiToUse - Discover the Best AI Tools for Every Need",
  description = "Find and master AI tools for school, business, content creation, and career development. Comprehensive directory with reviews, ratings, and expert recommendations.",
  keywords = ["AI tools", "artificial intelligence", "productivity", "business tools", "content creation", "education", "career development"],
  ogImage = "/og-image.jpg",
  ogType = "website",
  canonicalUrl = window.location.href
}) => {
  const fullTitle = title.includes("AiToUse") ? title : `${title} | AiToUse`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="AiToUse" />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="AiToUse" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Structured Data for Tools Directory */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "AiToUse",
          "description": description,
          "url": "https://aitouse.lovable.app",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://aitouse.lovable.app/tools?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
