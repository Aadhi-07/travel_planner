export const batch1Schema = {
    type: "object",
    properties: {
        abouttheplace: {
            type: "string",
            description: "about the place in atleast 50 words",
        },
        besttimetovisit: {
            type: "string",
            description: "Best time to visit",
        },
        tripHighlights: {
            type: "string",
            description: "A narrative story of the trip highlighting the journey and experiences",
        },
        weatherAnalysis: {
            type: "object",
            properties: {
                expectedConditions: { type: "string", description: "Detailed paragraph of expected weather conditions" },
                bestTimeToVisit: { type: "string", description: "Advice on the best time to visit based on weather" }
            },
            required: ["expectedConditions", "bestTimeToVisit"],
        },
    },
    "required": [
        "abouttheplace",
        "besttimetovisit",
        "tripHighlights",
        "weatherAnalysis"
    ],
};

export const batch2Schema = {
    type: "object",
    properties: {
        adventuresactivitiestodo: {
            type: "array",
            description: "Top adventures activities, atleast 5, like trekking, water sports, specify the place also",
            items: { type: "string" },
        },
        localcuisinerecommendations: {
            type: "array",
            description: "Local Cuisine Recommendations",
            items: { type: "string" },
        },
        packingchecklist: {
            type: "array",
            description: "Packing Checklist",
            items: { type: "string" },
        },
        budgetRange: {
            type: "object",
            properties: {
                totalEstimatedCost: { type: "string", description: "Total estimated cost range in INR based on duration and travelers" },
                essentials: { type: "string", description: "Essentials cost range" },
                transport: { type: "string", description: "Transport cost range" },
                accommodation: { type: "string", description: "Accommodation cost range" },
                food: { type: "string", description: "Food cost range" },
                insurance: { type: "string", description: "Insurance cost range" },
                contingency: { type: "string", description: "Contingency cost range" }
            },
            required: ["totalEstimatedCost", "essentials", "transport", "accommodation", "food", "insurance", "contingency"],
        },
    },
    "required": [
        "adventuresactivitiestodo",
        "localcuisinerecommendations",
        "packingchecklist",
        "budgetRange"
    ],
};

export const batch3Schema = {
    type: "object",
    properties: {
        itinerary: {
            type: "array",
            description: "Itinerary for the specified number of days in array format",
            items: {
                type: "object",
                properties: {
                    title: { type: "string", description: "Day title" },
                    activities: {
                        type: "object",
                        properties: {
                            morning: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        itineraryItem: { type: "string", description: "About the itinerary item" },
                                        briefDescription: { type: "string", description: "Elaborate about the place suggested" }
                                    },
                                    required: ["itineraryItem", "briefDescription"],
                                },
                            },
                            afternoon: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        itineraryItem: { type: "string", description: "About the itinerary item" },
                                        briefDescription: { type: "string", description: "Elaborate about the place suggested" }
                                    },
                                    required: ["itineraryItem", "briefDescription"],
                                },
                            },
                            evening: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        itineraryItem: { type: "string", description: "About the itinerary item" },
                                        briefDescription: { type: "string", description: "Elaborate about the place suggested" }
                                    },
                                    required: ["itineraryItem", "briefDescription"],
                                },
                            },
                            night: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        itineraryItem: { type: "string", description: "About the itinerary item" },
                                        briefDescription: { type: "string", description: "Elaborate about the place suggested" }
                                    },
                                    required: ["itineraryItem", "briefDescription"],
                                },
                            },
                        },
                        required: ["morning", "afternoon", "evening", "night"],
                    },
                    foodRecommendations: {
                        type: "object",
                        properties: {
                            breakfast: { type: "string" },
                            lunch: { type: "string" },
                            dinner: { type: "string" }
                        }
                    },
                    stayOptions: {
                        type: "array",
                        items: { type: "string", description: "Hotel name and details" }
                    },
                    optionalActivities: {
                        type: "array",
                        items: { type: "string" }
                    },
                    quickBookings: {
                        type: "array",
                        items: { type: "string" }
                    },
                    tips: { type: "string", description: "Helpful tips for the day" },
                },
                required: ["title", "activities", "foodRecommendations", "stayOptions", "optionalActivities", "quickBookings", "tips"],
            },
        },
        topplacestovisit: {
            type: "array",
            description: "Top places to visit along with their coordinates, atelast top 5, can be more",
            items: {
                type: "object",
                properties: {
                    name: { type: "string", description: "Name of the place" },
                    coordinates: {
                        type: "object",
                        properties: {
                            lat: { type: "number", description: "Latitude" },
                            lng: { type: "number", description: "Longitude" },
                        },
                        required: ["lat", "lng"],
                    },
                },
                required: ["name", "coordinates"],
            },
        },
    },
    "required": [
        "itinerary",
        "topplacestovisit"
    ],
};

export const singleDaySchema = {
    type: "object",
    properties: {
        title: { type: "string", description: "Day title" },
        activities: {
            type: "object",
            properties: {
                morning: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            itineraryItem: { type: "string", description: "About the itinerary item" },
                            briefDescription: { type: "string", description: "Elaborate about the place suggested" }
                        },
                        required: ["itineraryItem", "briefDescription"],
                    },
                },
                afternoon: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            itineraryItem: { type: "string", description: "About the itinerary item" },
                            briefDescription: { type: "string", description: "Elaborate about the place suggested" }
                        },
                        required: ["itineraryItem", "briefDescription"],
                    },
                },
                evening: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            itineraryItem: { type: "string", description: "About the itinerary item" },
                            briefDescription: { type: "string", description: "Elaborate about the place suggested" }
                        },
                        required: ["itineraryItem", "briefDescription"],
                    },
                },
                night: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            itineraryItem: { type: "string", description: "About the itinerary item" },
                            briefDescription: { type: "string", description: "Elaborate about the place suggested" }
                        },
                        required: ["itineraryItem", "briefDescription"],
                    },
                },
            },
            required: ["morning", "afternoon", "evening", "night"],
        },
        foodRecommendations: {
            type: "object",
            properties: {
                breakfast: { type: "string" },
                lunch: { type: "string" },
                dinner: { type: "string" }
            }
        },
        stayOptions: {
            type: "array",
            items: { type: "string", description: "Hotel name and details" }
        },
        optionalActivities: {
            type: "array",
            items: { type: "string", description: "Additional places or activities to do" }
        },
        quickBookings: {
            type: "array",
            items: { type: "string", description: "Things to book in advance" }
        },
        tips: { type: "string", description: "Pro-tip for the day" }
    },
    required: ["title", "activities", "foodRecommendations", "stayOptions", "optionalActivities", "quickBookings", "tips"],
};

export const fullPlanSchema = {
    type: "object",
    properties: {
        ...batch1Schema.properties,
        ...batch2Schema.properties,
        ...batch3Schema.properties,
    },
    required: [
        ...batch1Schema.required,
        ...batch2Schema.required,
        ...batch3Schema.required,
    ],
};