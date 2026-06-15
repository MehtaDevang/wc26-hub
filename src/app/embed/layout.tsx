import { EmbedMode } from "@/components/EmbedMode";

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EmbedMode />
      {children}
    </>
  );
}
