import Image from "next/image";

const LoadingIgr = () => {
  const skeletonRows = 13;
  const skeletonCols = 10;

  return (
    <div className="relative w-full">
      {/* 🔥 SKELETON */}
      <div className="overflow-hidden border border-accent rounded-md">
        <table className="min-w-full table-fixed">
          <thead>
            <tr>
              {Array.from({ length: skeletonCols }).map((_, i) => (
                <th key={i} className="border border-accent px-4 py-4 h-20">
                  <div className="h-4 bg-accent animate-pulse rounded w-3/4 mx-auto" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {Array.from({ length: skeletonCols }).map((_, colIdx) => (
                  <td
                    key={colIdx}
                    className="border border-accent px-2 py-2 h-10">
                    <div className="h-4 bg-accent animate-pulse rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 OVERLAY LOGO + SPINNER */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="relative flex justify-center items-center">
          {/* Spinner */}
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500 z-20"></div>

          {/* Logo */}
          <Image
            src="/images/loading.jpg"
            width={100}
            height={100}
            priority
            alt="IGR Logo"
            className="rounded-full z-10 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingIgr;
