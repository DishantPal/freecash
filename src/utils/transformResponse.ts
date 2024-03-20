import { getCachedData } from "../routes/surveys/surveys.cache";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  let day = ("0" + date.getDate()).slice(-2); // Ensure two digits
  let month = ("0" + (date.getMonth() + 1)).slice(-2); // Ensure two digits
  let year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
function transformData(
  item: any,
  modelConfig: any,
  lang: string,
  currency: string
): any {
  currency = currency.trim().replace(/^"|"$/g, "");
  return Object.entries(item).reduce((newItem: any, [key, value]: any) => {
    // if (!modelConfig.hidden.includes(key)) {
    // Translate fields
    if (modelConfig.translatable.includes(key)) {
      value = JSON.parse(value);
      newItem[key] = value[lang] || value;
    }
    // Format money fields
    else if (modelConfig.money.includes(key)) {
      newItem[key] = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(value);
    }
    // Format date fields
    else if (modelConfig.date.includes(key)) {
      newItem[key] = formatDate(value);
    }
    // Copy other fields as-is
    else {
      newItem[key] = value;
    }
    return newItem;
  }, {});
}

async function transformResponse(
  data: any,
  modelConfig: any,
  lang: string,
  currency: string
): Promise<any> {
  if (Array.isArray(data)) {
    return data.map((item) => transformData(item, modelConfig, lang, currency));
  } else {
    return transformData(data, modelConfig, lang, currency);
  }
}
export default transformResponse;
