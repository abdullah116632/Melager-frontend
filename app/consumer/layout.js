import ConsumerNavbar from "@/components/consumer/ConsumerNavbar";

export default function ConsumerLayout({ children }) {
  return (
    <>
      <ConsumerNavbar />
      {children}
    </>
  );
}
