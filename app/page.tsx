import React from "react";
import { getAllPosts, PostData } from "@/lib/mdx";

const posts: PostData[] = getAllPosts();
const Home = () => {
  return <div>ようこそ</div>;
};

export default Home;
