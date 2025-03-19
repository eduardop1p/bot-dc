/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementHandle } from 'puppeteer';

export default async function getAttribute(
  page: any,
  element: ElementHandle<HTMLAnchorElement> | null,
  attributeName: string
) {
  try {
    if (!element) return '';

    return await page.evaluate((element: HTMLAnchorElement) => {
      const attribute = element.getAttribute(attributeName);
      return attribute ? attribute.trim() : '';
    }, element);
  } catch {
    return '';
  }
}
