/**
 * 
 * @param {*} Letter Obj 
 * @returns 
 */
export async function postLetterAPI({
  senderId,
  sender,
  letter,
  houseNumber,
  streetName,
  postCode,
  postage,
}) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/postLetter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId,
        sender,
        letter,
        houseNumber,
        streetName,
        postCode,
        postage,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('sendLetter error:', error);
    throw error;
  }
}