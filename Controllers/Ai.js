const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Ai = require('../Models/Ai');  // Correct import for Ai model

// Initialize the AI model
const genAI = new GoogleGenerativeAI("AIzaSyAuPNbsajUF_42Cnm7lV351OZ2IhUsHveU");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Static data that you want to include in the prompt (Islamic context for Cameroon)
const data = [
    "Cameroon is home to a significant Muslim population, especially in the northern regions such as the Adamawa, North, and Far North. The practice of Islam in Cameroon dates back several centuries, and today, it plays a major role in the culture and daily life of many Cameroonians.",
    "The majority of Muslims in Cameroon follow Sunni Islam, with some smaller communities practicing Shia Islam. The country is also home to various Islamic sects, including Sufi orders like the Tijaniyyah and Qadiriyyah.",
    "Cameroonian Muslims observe important religious practices such as daily prayers (Salah), fasting during the month of Ramadan, and paying Zakat (almsgiving). In addition, Hajj, the pilgrimage to Mecca, is considered an essential religious duty for those who are financially able.",
    "The central mosque in Yaoundé, known as the Yaoundé Central Mosque, serves as the spiritual heart of the Muslim community in the capital. Similarly, the Grand Mosque in Garoua is another key place of worship and learning.",
    "Islamic education is a fundamental part of Muslim life in Cameroon. Many Muslim families send their children to Islamic schools (madrasas) for religious and academic learning, alongside formal schooling.",
    "There are also numerous Islamic charitable organizations in Cameroon that work on development programs such as building schools, providing water wells, and supporting healthcare initiatives, in line with the Islamic principles of charity and social justice.",
    "Islamic art, architecture, and cultural traditions have enriched Cameroon's heritage, with many mosques and Islamic centers showcasing beautiful traditional designs and calligraphy.",
    "Cameroon is home to a number of Muslim scholars who have contributed to the spread of Islamic knowledge across the region, and many young Cameroonians travel abroad to further their Islamic studies, particularly to countries like Saudi Arabia, Egypt, and Sudan.",
    "During the Eid al-Fitr and Eid al-Adha festivals, Muslim communities in Cameroon come together for prayers, feasts, and acts of charity. The celebrations include the slaughtering of animals for Eid al-Adha and the giving of Zakat al-Fitr to the needy.",
    "Islam plays a vital role in the social fabric of Cameroon, fostering community cohesion, social welfare, and promoting values of peace, tolerance, and respect for diversity among the country's many ethnic and religious groups."
];

// Generate content function
const generateContent = async (req, res) => {
    try {
        const prompt = `Your name is Bilal AI and you are an Islamic culture AI trained on the data joint ${data.join(" ")}, now give me accurate responses to this: ${req.body.prompt}` || `Hi there, please study this information: ${data.join(" ")}`; // Use Islamic context data in the prompt
        // console.log("Prompt:", prompt);

        // Generate the content using the AI model
        const result = await model.generateContent(prompt);
        // console.log("Full AI Response:", result);

        // Call the 'text' function to get the generated text
        const generatedText = await result.response.text();

        if (generatedText) {
            // Save the prompt and response in the database
            const newAiEntry = new Ai({
                prompt: prompt,
                response: generatedText,
            });

            await newAiEntry.save();  // Save to the database

            // Send the AI-generated content back to the client
            res.json({ text: generatedText });
        } else {
            res.status(500).json({ error: "AI response is empty" });
        }
    } catch (error) {
        console.error("Error generating AI content:", error);
        res.status(500).json({ error: "Failed to generate content" });
    }
};

module.exports = { generateContent };
