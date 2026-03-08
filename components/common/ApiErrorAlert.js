export default function ApiErrorAlert({ error, fallbackMessage = "Something went wrong." }) {
  if (!error) {
    return null;
  }

  const message =
    typeof error === "string"
      ? error
      : error?.message || error?.error || fallbackMessage;

  const details = Array.isArray(error?.errors)
    ? error.errors
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return item?.message || item?.msg || "";
        })
        .filter(Boolean)
    : [];

  const statusCode = error?.statusCode || error?.status;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
      <p className="font-semibold">{message}</p>
      {statusCode ? <p className="mt-1">Status: {statusCode}</p> : null}
      {details.length > 0 ? (
        <ul className="mt-1 list-disc pl-4">
          {details.map((detail, index) => (
            <li key={`${detail}-${index}`}>{detail}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
