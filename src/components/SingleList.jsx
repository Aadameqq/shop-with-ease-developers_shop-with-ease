export const SingleList = ({ title, id }) => {
  return (
    <a
      href={`/lists/${id}`}
      className="w-full max-w-[800px]"
    >
      <div className=" flex w-full  flex-col items-center justify-between rounded-md border-2 border-zinc-200 bg-zinc-50 px-3 py-3 transition-all ease-in-out hover:bg-white hover:shadow-md md:flex-row">
        <h3 className=" text-lg text-zinc-700 ">{title}</h3>
      </div>
    </a>
  );
};
