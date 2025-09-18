import HomePage from "@/components/Home";
import { env } from "@/lib/env";
import { Metadata } from "next";

const appUrl = env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/images/feed.png`,
  button: {
    title: "📊 Analyze Wallet",
    action: {
      type: "launch_frame",
      name: "Base Analytics",
      url: appUrl,
      splashImageUrl: `${appUrl}/images/splash.png`,
      splashBackgroundColor: "#6D28D9",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Base Analytics",
    openGraph: {
      title: "Base Analytics",
      description: "Analyze Base wallet transactions and activity patterns",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <HomePage />;
}