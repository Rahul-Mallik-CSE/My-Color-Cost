/** @format */

// redux/StoreProvider.tsx
"use client";
import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use useState with lazy initialization to create the store only once
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
