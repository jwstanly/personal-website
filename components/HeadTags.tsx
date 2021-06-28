import Head from "next/head";
import React from "react";

interface HeadTagsProps {
  title: string;
  url?: string;
  description?: string;
  color?: string;
  type?: "article" | "book" | "profile" | "website" |
    "video.movie" | "video.episode" | "video.tv_show" | "video.other" | 
    "music.song" | "music.album" | "music.playlist" | "music.radio_station",

  imageUrl?: string;
  imageType?: string;
  imageHeight?: number;
  imageWidth?: number;
  imageAlt?: string;
  
  twitterCardType?: "summary" | "summary_large_image" | "app" | "player";

  videoUrl?: string;
  videoHeight?: number;
  videoWidth?: number;
};

export default function HeadTags(props: HeadTagsProps) {

  const description = props.description || "Blog for John Wright Stanly"


  return <Head>
    <title>{props.title}</title>

    <link rel="icon" href="/favicon.ico" />
      
    <meta name="name" content={props.title} />
    <meta name="description" content={description.substring(0,160)} />
    <meta name="theme-color" content={props.color || "#F8F8F8"} />

    <meta property="og:site_name" content="Jwstanly" />
    <meta property="og:title" content={props.title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={props.url || 'https://jwstanly.com'} />
    <meta property="og:type" content={props.type || "website"} />
    <meta property="og:locale" content="en_US" />

    <meta property="og:image" content={props.imageUrl || 'https://jwstanly.com/logo192.png'}/>
    <meta property="og:image:url" content={props.imageUrl || 'https://jwstanly.com/logo192.png'}/>
    <meta property="og:image:secure_url" content={props.imageUrl || 'https://jwstanly.com/logo192.png'} />
    <meta property="og:image:alt" content={props.imageAlt || props.title} />
    {props.imageType && <meta property="og:image:type" content={props.imageType} />}
    {props.imageWidth && <meta property="og:image:width" content={String(props.imageWidth)} />}
    {props.imageHeight && <meta property="og:image:height" content={String(props.imageHeight)} />}    

    <meta name="twitter:card" content={props.twitterCardType || "summary"} />
    <meta name="twitter:site" content="@jwstanly" />
    <meta name="twitter:title" content={props.title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={props.imageUrl || 'https://jwstanly.com/logo192.png'} />
    <meta name="twitter:image:alt" content={props.imageAlt || props.title}  />

    {props.videoUrl &&
      <>
        <meta name="twitter:player" content={props.videoUrl} />
        <meta name="twitter:player:width" content={String(props.videoWidth) || "1280"} />
        <meta name="twitter:player:height" content={String(props.videoHeight) || "720"} />
        <meta name="twitter:player:stream" content={props.videoUrl} />
        
        <meta property="og:video" content={props.videoUrl} />
        <meta property="og:video:secure_url" content={props.videoUrl} />
        <meta property="og:video:type" content="video/mp4" />
        <meta property="og:video:width" content={String(props.videoWidth) || "1280"} />
        <meta property="og:video:height" content={String(props.videoHeight) || "720"} /> 
      </>
    }
  </Head>
}
