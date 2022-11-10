export const customFetcher = async (data) => {
  const { target, bodyObj, method } = data;

  const res = await fetch(`/api${target}`, {
    method: `${method}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(bodyObj),
  });

  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;

    throw new Error(reason);
  }

  return res;
};
