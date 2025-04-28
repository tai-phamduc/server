import * as tf from '@tensorflow/tfjs';
import sentimentService from './sentimentService';

// Advanced Sentiment Analysis Service
const advancedSentimentService = {
  // Analyze sentiment with aspect extraction
  analyzeWithAspects: async (text) => {
    try {
      // Get basic sentiment analysis
      const basicSentiment = await sentimentService.analyzeSentiment(text);
      
      // In a real implementation, this would use a more sophisticated model
      // For now, we'll use a rule-based approach to extract aspects
      
      // Define aspects to look for
      const aspects = {
        acting: {
          keywords: ['acting', 'actor', 'actress', 'performance', 'cast', 'played', 'role', 'character', 'portrayal'],
          sentiment: 0,
          count: 0,
          mentions: []
        },
        plot: {
          keywords: ['plot', 'story', 'storyline', 'narrative', 'writing', 'script', 'screenplay', 'dialogue', 'pacing'],
          sentiment: 0,
          count: 0,
          mentions: []
        },
        visuals: {
          keywords: ['visual', 'visuals', 'cinematography', 'effects', 'cgi', 'animation', 'camera', 'shot', 'scene', 'graphic'],
          sentiment: 0,
          count: 0,
          mentions: []
        },
        sound: {
          keywords: ['sound', 'music', 'score', 'soundtrack', 'audio', 'song', 'composer', 'theme'],
          sentiment: 0,
          count: 0,
          mentions: []
        },
        directing: {
          keywords: ['directing', 'director', 'direction', 'filmmaker', 'vision', 'pacing'],
          sentiment: 0,
          count: 0,
          mentions: []
        }
      };
      
      // Extract sentences
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      // Analyze each sentence for aspects
      sentences.forEach(sentence => {
        const lowerSentence = sentence.toLowerCase();
        
        // Check for aspects
        Object.keys(aspects).forEach(aspect => {
          const keywords = aspects[aspect].keywords;
          
          // Check if any keyword is present
          const foundKeywords = keywords.filter(keyword => lowerSentence.includes(keyword));
          
          if (foundKeywords.length > 0) {
            // Analyze sentiment of this sentence
            const sentimentScore = analyzeSentenceSimple(lowerSentence);
            
            // Add to aspect data
            aspects[aspect].sentiment += sentimentScore;
            aspects[aspect].count++;
            aspects[aspect].mentions.push({
              text: sentence.trim(),
              sentiment: sentimentScore,
              keywords: foundKeywords
            });
          }
        });
      });
      
      // Calculate average sentiment for each aspect
      Object.keys(aspects).forEach(aspect => {
        if (aspects[aspect].count > 0) {
          aspects[aspect].sentiment = aspects[aspect].sentiment / aspects[aspect].count;
        }
      });
      
      // Extract top positive and negative aspects
      const aspectSentiments = Object.entries(aspects)
        .filter(([_, data]) => data.count > 0)
        .map(([name, data]) => ({
          name,
          sentiment: data.sentiment,
          count: data.count,
          mentions: data.mentions
        }))
        .sort((a, b) => b.sentiment - a.sentiment);
      
      const topPositive = aspectSentiments.filter(a => a.sentiment > 0).slice(0, 2);
      const topNegative = aspectSentiments.filter(a => a.sentiment < 0)
        .sort((a, b) => a.sentiment - b.sentiment)
        .slice(0, 2);
      
      // Extract key phrases
      const keyPhrases = extractKeyPhrases(text);
      
      return {
        ...basicSentiment,
        aspects,
        aspectSentiments,
        topPositive,
        topNegative,
        keyPhrases
      };
    } catch (error) {
      console.error('Error analyzing sentiment with aspects:', error);
      return null;
    }
  },
  
  // Analyze multiple reviews with aspect extraction
  analyzeReviewsWithAspects: async (reviews) => {
    try {
      // Process each review
      const results = await Promise.all(
        reviews.map(review => advancedSentimentService.analyzeWithAspects(review.comment || ''))
      );
      
      // Filter out null results
      const validResults = results.filter(result => result !== null);
      
      // Calculate overall sentiment
      const basicSentiment = await sentimentService.analyzeReviews(reviews);
      
      // Aggregate aspect sentiments
      const aspectAggregates = {
        acting: { total: 0, count: 0, positive: 0, negative: 0, neutral: 0 },
        plot: { total: 0, count: 0, positive: 0, negative: 0, neutral: 0 },
        visuals: { total: 0, count: 0, positive: 0, negative: 0, neutral: 0 },
        sound: { total: 0, count: 0, positive: 0, negative: 0, neutral: 0 },
        directing: { total: 0, count: 0, positive: 0, negative: 0, neutral: 0 }
      };
      
      // Collect all key phrases
      const allKeyPhrases = [];
      
      // Process each result
      validResults.forEach(result => {
        // Add key phrases
        allKeyPhrases.push(...result.keyPhrases);
        
        // Aggregate aspect data
        Object.keys(result.aspects).forEach(aspect => {
          const aspectData = result.aspects[aspect];
          if (aspectData.count > 0) {
            aspectAggregates[aspect].total += aspectData.sentiment;
            aspectAggregates[aspect].count += aspectData.count;
            
            // Count sentiment categories
            if (aspectData.sentiment > 0.2) {
              aspectAggregates[aspect].positive++;
            } else if (aspectData.sentiment < -0.2) {
              aspectAggregates[aspect].negative++;
            } else {
              aspectAggregates[aspect].neutral++;
            }
          }
        });
      });
      
      // Calculate average sentiment for each aspect
      const aspectSentiments = Object.entries(aspectAggregates)
        .map(([name, data]) => {
          const averageSentiment = data.count > 0 ? data.total / data.count : 0;
          const mentionPercentage = validResults.length > 0 ? 
            Math.round((data.count / validResults.length) * 100) : 0;
          
          return {
            name,
            sentiment: averageSentiment,
            count: data.count,
            mentionPercentage,
            distribution: {
              positive: data.positive,
              neutral: data.neutral,
              negative: data.negative
            }
          };
        })
        .filter(aspect => aspect.count > 0)
        .sort((a, b) => b.count - a.count);
      
      // Get top positive and negative aspects
      const topPositive = aspectSentiments
        .filter(a => a.sentiment > 0)
        .sort((a, b) => b.sentiment - a.sentiment)
        .slice(0, 2);
      
      const topNegative = aspectSentiments
        .filter(a => a.sentiment < 0)
        .sort((a, b) => a.sentiment - b.sentiment)
        .slice(0, 2);
      
      // Get top key phrases
      const topKeyPhrases = getTopKeyPhrases(allKeyPhrases, 10);
      
      return {
        ...basicSentiment,
        aspectSentiments,
        topPositive,
        topNegative,
        topKeyPhrases,
        reviewsAnalyzed: validResults.length
      };
    } catch (error) {
      console.error('Error analyzing reviews with aspects:', error);
      return null;
    }
  },
  
  // Generate insights from sentiment analysis
  generateInsights: async (reviews) => {
    try {
      // Analyze reviews with aspects
      const analysis = await advancedSentimentService.analyzeReviewsWithAspects(reviews);
      if (!analysis) throw new Error('Analysis failed');
      
      // Generate insights
      const insights = [];
      
      // Overall sentiment insight
      insights.push({
        type: 'overall',
        title: `Overall Audience Sentiment: ${capitalizeFirstLetter(analysis.sentiment)}`,
        description: `${analysis.positive} out of ${analysis.total} reviews (${Math.round((analysis.positive / analysis.total) * 100)}%) express positive sentiment.`,
        sentiment: analysis.sentiment
      });
      
      // Top positive aspects
      if (analysis.topPositive.length > 0) {
        analysis.topPositive.forEach(aspect => {
          insights.push({
            type: 'positive_aspect',
            title: `Strong ${capitalizeFirstLetter(aspect.name)}`,
            description: `${aspect.mentionPercentage}% of reviews mention ${aspect.name} positively.`,
            sentiment: 'positive',
            aspect: aspect.name
          });
        });
      }
      
      // Top negative aspects
      if (analysis.topNegative.length > 0) {
        analysis.topNegative.forEach(aspect => {
          insights.push({
            type: 'negative_aspect',
            title: `Weak ${capitalizeFirstLetter(aspect.name)}`,
            description: `${aspect.mentionPercentage}% of reviews mention ${aspect.name} negatively.`,
            sentiment: 'negative',
            aspect: aspect.name
          });
        });
      }
      
      // Most mentioned aspect
      const mostMentioned = analysis.aspectSentiments[0];
      if (mostMentioned) {
        insights.push({
          type: 'most_mentioned',
          title: `Most Discussed: ${capitalizeFirstLetter(mostMentioned.name)}`,
          description: `${mostMentioned.mentionPercentage}% of reviews discuss the ${mostMentioned.name}.`,
          sentiment: mostMentioned.sentiment > 0 ? 'positive' : (mostMentioned.sentiment < 0 ? 'negative' : 'neutral'),
          aspect: mostMentioned.name
        });
      }
      
      // Key phrases insight
      if (analysis.topKeyPhrases && analysis.topKeyPhrases.length > 0) {
        const phraseList = analysis.topKeyPhrases
          .slice(0, 3)
          .map(phrase => `"${phrase.text}"`)
          .join(', ');
        
        insights.push({
          type: 'key_phrases',
          title: 'Common Themes in Reviews',
          description: `Audiences frequently mention: ${phraseList}.`,
          sentiment: 'neutral'
        });
      }
      
      // Consensus insight
      const consensusLevel = getConsensusLevel(analysis);
      insights.push({
        type: 'consensus',
        title: `Audience Consensus: ${consensusLevel.label}`,
        description: consensusLevel.description,
        sentiment: 'neutral'
      });
      
      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }
};

// Helper function to analyze sentence sentiment (simplified)
const analyzeSentenceSimple = (sentence) => {
  // Positive and negative word lists
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'awesome', 'fantastic',
    'wonderful', 'love', 'best', 'favorite', 'enjoyed', 'recommend',
    'impressive', 'beautiful', 'perfect', 'outstanding', 'brilliant',
    'superb', 'masterpiece', 'incredible', 'stunning', 'entertaining',
    'enjoyable', 'fun', 'exciting', 'engaging', 'captivating',
    'hay', 'tốt', 'tuyệt vời', 'xuất sắc', 'thích', 'yêu thích',
    'ấn tượng', 'đẹp', 'hoàn hảo', 'nổi bật', 'tuyệt phẩm', 'giải trí',
    'vui', 'hấp dẫn', 'cuốn hút'
  ];
  
  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'disappointing', 'poor',
    'waste', 'boring', 'dull', 'mediocre', 'overrated', 'worst',
    'hate', 'dislike', 'confusing', 'slow', 'predictable', 'stupid',
    'ridiculous', 'annoying', 'terrible', 'awful', 'unwatchable',
    'tệ', 'khủng khiếp', 'thất vọng', 'kém', 'lãng phí', 'nhàm chán',
    'trung bình', 'đánh giá quá cao', 'ghét', 'không thích', 'khó hiểu',
    'chậm', 'dễ đoán', 'ngớ ngẩn', 'lố bịch', 'khó chịu', 'không xem được'
  ];
  
  // Count positive and negative words
  let positiveCount = 0;
  let negativeCount = 0;
  
  // Check for positive words
  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = sentence.match(regex);
    if (matches) {
      positiveCount += matches.length;
    }
  });
  
  // Check for negative words
  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = sentence.match(regex);
    if (matches) {
      negativeCount += matches.length;
    }
  });
  
  // Calculate sentiment score (-1 to 1)
  const totalWords = positiveCount + negativeCount;
  let sentimentScore = 0;
  
  if (totalWords > 0) {
    sentimentScore = (positiveCount - negativeCount) / totalWords;
  }
  
  return sentimentScore;
};

// Helper function to extract key phrases
const extractKeyPhrases = (text) => {
  // In a real implementation, this would use NLP techniques
  // For now, we'll use a simple approach to extract noun phrases
  
  // Split into sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Common words to filter out
  const stopWords = ['the', 'a', 'an', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with', 'in', 'out', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could', 'of', 'that', 'this', 'these', 'those', 'it', 'its', 'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'whose', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself'];
  
  // Potential key phrases
  const phrases = [];
  
  // Process each sentence
  sentences.forEach(sentence => {
    // Clean and tokenize
    const words = sentence.trim().toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0 && !stopWords.includes(word));
    
    // Extract potential phrases (2-3 word sequences)
    for (let i = 0; i < words.length - 1; i++) {
      // 2-word phrases
      if (i < words.length - 1) {
        phrases.push({
          text: `${words[i]} ${words[i+1]}`,
          count: 1
        });
      }
      
      // 3-word phrases
      if (i < words.length - 2) {
        phrases.push({
          text: `${words[i]} ${words[i+1]} ${words[i+2]}`,
          count: 1
        });
      }
    }
  });
  
  // Combine duplicate phrases
  const phraseCounts = {};
  phrases.forEach(phrase => {
    phraseCounts[phrase.text] = (phraseCounts[phrase.text] || 0) + 1;
  });
  
  // Convert to array and sort
  return Object.entries(phraseCounts)
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count);
};

// Helper function to get top key phrases
const getTopKeyPhrases = (phrases, limit = 10) => {
  // Combine duplicate phrases
  const phraseCounts = {};
  phrases.forEach(phrase => {
    phraseCounts[phrase.text] = (phraseCounts[phrase.text] || 0) + phrase.count;
  });
  
  // Convert to array and sort
  return Object.entries(phraseCounts)
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Helper function to get consensus level
const getConsensusLevel = (analysis) => {
  // Calculate standard deviation of sentiment
  const sentimentDistribution = {
    positive: analysis.positive / analysis.total,
    neutral: analysis.neutral / analysis.total,
    negative: analysis.negative / analysis.total
  };
  
  // Calculate entropy (higher entropy = less consensus)
  let entropy = 0;
  Object.values(sentimentDistribution).forEach(p => {
    if (p > 0) {
      entropy -= p * Math.log2(p);
    }
  });
  
  // Normalize entropy (0-1)
  const maxEntropy = Math.log2(3); // 3 categories: positive, neutral, negative
  const normalizedEntropy = entropy / maxEntropy;
  
  // Determine consensus level
  if (normalizedEntropy < 0.5) {
    return {
      label: 'Strong',
      description: 'Audiences show strong agreement in their opinions about this movie.'
    };
  } else if (normalizedEntropy < 0.8) {
    return {
      label: 'Moderate',
      description: 'There is moderate agreement among audiences, with some differing opinions.'
    };
  } else {
    return {
      label: 'Divided',
      description: 'Audiences are divided in their opinions about this movie.'
    };
  }
};

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default advancedSentimentService;
