// Browser downloads for the Publish screen. Kept out of the component files so
// that fast refresh keeps working there.

/** Download generated text (a data file, a JSON bundle) as a file. */
export function downloadText(fileName: string, contents: string, mime: string): void {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Download an image the editor uploaded, which is already a data URL. */
export function downloadDataUrl(fileName: string, dataUrl: string): void {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = fileName;
  anchor.click();
}
