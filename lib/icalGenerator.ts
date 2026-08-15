export function generateICalString(plan: any): string {
  const destination = plan?.nameoftheplace || "Trip";
  const itinerary = plan?.itinerary || [];
  const baseDateMs = plan?.fromDate || Date.now() + 86400000;

  const formatDateToICS = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  let eventsStr = "";

  itinerary.forEach((dayItem: any, index: number) => {
    const dayDate = new Date(baseDateMs + index * 86400000);
    const nextDate = new Date(baseDateMs + (index + 1) * 86400000);

    const title = dayItem?.title ? `Day ${index + 1}: ${dayItem.title}` : `Day ${index + 1} in ${destination}`;
    
    // Build description
    const morning = (dayItem?.activities?.morning || [])
      .map((a: any) => `- Morning: ${a.itineraryItem || ""} ${a.briefDescription || ""}`)
      .join("\n");
    const afternoon = (dayItem?.activities?.afternoon || [])
      .map((a: any) => `- Afternoon: ${a.itineraryItem || ""} ${a.briefDescription || ""}`)
      .join("\n");
    const evening = (dayItem?.activities?.evening || [])
      .map((a: any) => `- Evening: ${a.itineraryItem || ""} ${a.briefDescription || ""}`)
      .join("\n");
    const tips = dayItem?.tips ? `\nTips: ${dayItem.tips}` : "";

    const fullDescription = `${title}\n\n${morning}\n${afternoon}\n${evening}${tips}`.replace(/\n/g, "\\n");

    eventsStr += `BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${fullDescription}
LOCATION:${destination}
DTSTART;VALUE=DATE:${formatDateToICS(dayDate)}
DTEND;VALUE=DATE:${formatDateToICS(nextDate)}
STATUS:CONFIRMED
END:VEVENT
`;
  });

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TravelPlannerAI//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Trip to ${destination}
${eventsStr}END:VCALENDAR`;
}

export function downloadICalFile(plan: any) {
  if (typeof window === "undefined") return;
  const destination = (plan?.nameoftheplace || "Trip").replace(/[^a-zA-Z0-9]/g, "_");
  const icsData = generateICalString(plan);

  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${destination}_Itinerary.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
