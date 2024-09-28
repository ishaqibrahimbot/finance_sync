export const Section = ({ children }: { children?: React.ReactNode }) => {
  return (
    <section className="bg-white shadow-md rounded-md m-4 p-8 flex flex-col space-y-2">
      {children}
    </section>
  );
};
