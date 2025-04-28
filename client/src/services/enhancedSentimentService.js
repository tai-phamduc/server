/**
 * Enhanced Sentiment Analysis Service
 * 
 * Provides advanced sentiment analysis capabilities:
 * - Multi-dimensional sentiment analysis (beyond positive/negative)
 * - Aspect-based sentiment analysis
 * - Topic extraction
 * - Keyword extraction
 * - Emotion detection
 */

// Predefined aspects for movies
const MOVIE_ASPECTS = [
  'acting', 'plot', 'visuals', 'soundtrack', 'directing', 
  'pacing', 'dialogue', 'characters', 'cinematography', 'special effects',
  'story', 'ending', 'action scenes', 'humor', 'emotional impact'
];

// Emotion categories
const EMOTIONS = [
  'joy', 'sadness', 'anger', 'fear', 'surprise', 
  'disgust', 'anticipation', 'trust'
];

/**
 * Analyze sentiment of a single text
 * @param {string} text - Text to analyze
 * @returns {Object} - Sentiment analysis results
 */
const analyzeSentiment = (text) => {
  try {
    if (!text || typeof text !== 'string') {
      return {
        sentiment: 'neutral',
        score: 0.5,
        confidence: 0
      };
    }
    
    // Convert to lowercase for analysis
    const lowerText = text.toLowerCase();
    
    // Simple keyword-based sentiment analysis
    const positiveWords = [
      'amazing', 'awesome', 'beautiful', 'brilliant', 'excellent', 
      'fantastic', 'good', 'great', 'love', 'outstanding', 
      'perfect', 'superb', 'wonderful', 'best', 'enjoyed',
      'recommend', 'masterpiece', 'incredible', 'stunning', 'favorite'
    ];
    
    const negativeWords = [
      'awful', 'bad', 'boring', 'disappointing', 'dreadful', 
      'horrible', 'mediocre', 'poor', 'terrible', 'waste', 
      'worst', 'hate', 'dislike', 'stupid', 'annoying',
      'awful', 'dull', 'failure', 'mess', 'unwatchable'
    ];
    
    // Count word occurrences
    let positiveCount = 0;
    let negativeCount = 0;
    
    // Check for positive words
    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        positiveCount += matches.length;
      }
    });
    
    // Check for negative words
    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        negativeCount += matches.length;
      }
    });
    
    // Check for negations
    const negations = ['not', 'no', 'never', "don't", "doesn't", "didn't", "wasn't", "weren't", "isn't", "aren't"];
    let negationCount = 0;
    
    negations.forEach(negation => {
      const regex = new RegExp(`\\b${negation}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        negationCount += matches.length;
      }
    });
    
    // Adjust counts based on negations (simplified approach)
    if (negationCount > 0) {
      // Swap a portion of positive and negative counts based on negations
      const swapAmount = Math.min(positiveCount, negativeCount, negationCount);
      positiveCount = positiveCount - swapAmount + negationCount * 0.5;
      negativeCount = negativeCount - swapAmount + negationCount * 0.5;
    }
    
    // Calculate sentiment score (0 to 1)
    const totalWords = text.split(/\s+/).length;
    const positiveScore = positiveCount / Math.max(totalWords, 1);
    const negativeScore = negativeCount / Math.max(totalWords, 1);
    
    let sentimentScore = 0.5; // Neutral default
    
    if (positiveCount > 0 || negativeCount > 0) {
      sentimentScore = positiveScore / (positiveScore + negativeScore);
    }
    
    // Determine sentiment category
    let sentiment;
    if (sentimentScore >= 0.75) {
      sentiment = 'very positive';
    } else if (sentimentScore >= 0.6) {
      sentiment = 'positive';
    } else if (sentimentScore >= 0.4) {
      sentiment = 'neutral';
    } else if (sentimentScore >= 0.25) {
      sentiment = 'negative';
    } else {
      sentiment = 'very negative';
    }
    
    // Calculate confidence based on word count and sentiment strength
    const confidence = Math.min(
      1, 
      (positiveCount + negativeCount) / Math.max(totalWords * 0.1, 1)
    );
    
    return {
      sentiment,
      score: sentimentScore,
      confidence,
      positiveScore,
      negativeScore,
      wordCount: totalWords
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return {
      sentiment: 'neutral',
      score: 0.5,
      confidence: 0
    };
  }
};

/**
 * Analyze sentiment for multiple reviews
 * @param {Array} reviews - Array of review objects
 * @returns {Object} - Aggregated sentiment analysis
 */
const analyzeReviews = (reviews) => {
  try {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return {
        sentiment: 'neutral',
        score: 0.5,
        distribution: {
          'very positive': 0,
          'positive': 0,
          'neutral': 100,
          'negative': 0,
          'very negative': 0
        },
        confidence: 0
      };
    }
    
    // Analyze each review
    const results = reviews.map(review => {
      const text = review.comment || review.text || '';
      return analyzeSentiment(text);
    });
    
    // Calculate average score
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const averageScore = totalScore / results.length;
    
    // Calculate sentiment distribution
    const distribution = {
      'very positive': 0,
      'positive': 0,
      'neutral': 0,
      'negative': 0,
      'very negative': 0
    };
    
    results.forEach(result => {
      distribution[result.sentiment] += 1;
    });
    
    // Convert to percentages
    Object.keys(distribution).forEach(key => {
      distribution[key] = Math.round((distribution[key] / results.length) * 100);
    });
    
    // Determine overall sentiment
    let overallSentiment;
    if (averageScore >= 0.75) {
      overallSentiment = 'very positive';
    } else if (averageScore >= 0.6) {
      overallSentiment = 'positive';
    } else if (averageScore >= 0.4) {
      overallSentiment = 'neutral';
    } else if (averageScore >= 0.25) {
      overallSentiment = 'negative';
    } else {
      overallSentiment = 'very negative';
    }
    
    // Calculate average confidence
    const totalConfidence = results.reduce((sum, result) => sum + result.confidence, 0);
    const averageConfidence = totalConfidence / results.length;
    
    return {
      sentiment: overallSentiment,
      score: averageScore,
      distribution,
      confidence: averageConfidence,
      reviewCount: reviews.length
    };
  } catch (error) {
    console.error('Error analyzing reviews:', error);
    return {
      sentiment: 'neutral',
      score: 0.5,
      distribution: {
        'very positive': 0,
        'positive': 0,
        'neutral': 100,
        'negative': 0,
        'very negative': 0
      },
      confidence: 0
    };
  }
};

/**
 * Extract aspects from text and analyze sentiment for each aspect
 * @param {string} text - Text to analyze
 * @returns {Object} - Aspect-based sentiment analysis
 */
const extractAspects = (text) => {
  try {
    if (!text || typeof text !== 'string') {
      return {
        aspects: {},
        detectedAspects: []
      };
    }
    
    const lowerText = text.toLowerCase();
    const aspects = {};
    const detectedAspects = [];
    
    // Check for each aspect in the text
    MOVIE_ASPECTS.forEach(aspect => {
      // Create regex to find the aspect
      const regex = new RegExp(`\\b${aspect}\\b`, 'gi');
      const matches = lowerText.match(regex);
      
      if (matches) {
        // Find sentences containing this aspect
        const sentences = text.split(/[.!?]+/);
        const relevantSentences = sentences.filter(sentence => 
          sentence.toLowerCase().includes(aspect)
        );
        
        if (relevantSentences.length > 0) {
          // Analyze sentiment for these sentences
          const sentiments = relevantSentences.map(sentence => analyzeSentiment(sentence));
          
          // Calculate average sentiment
          const totalScore = sentiments.reduce((sum, result) => sum + result.score, 0);
          const averageScore = totalScore / sentiments.length;
          
          // Determine sentiment category
          let sentiment;
          if (averageScore >= 0.75) {
            sentiment = 'very positive';
          } else if (averageScore >= 0.6) {
            sentiment = 'positive';
          } else if (averageScore >= 0.4) {
            sentiment = 'neutral';
          } else if (averageScore >= 0.25) {
            sentiment = 'negative';
          } else {
            sentiment = 'very negative';
          }
          
          // Store aspect analysis
          aspects[aspect] = {
            sentiment,
            score: averageScore,
            count: matches.length,
            examples: relevantSentences.slice(0, 2) // Include up to 2 example sentences
          };
          
          detectedAspects.push(aspect);
        }
      }
    });
    
    return {
      aspects,
      detectedAspects
    };
  } catch (error) {
    console.error('Error extracting aspects:', error);
    return {
      aspects: {},
      detectedAspects: []
    };
  }
};

/**
 * Analyze sentiment with aspect extraction for a single text
 * @param {string} text - Text to analyze
 * @returns {Object} - Sentiment and aspect analysis
 */
const analyzeWithAspects = (text) => {
  try {
    const sentimentAnalysis = analyzeSentiment(text);
    const aspectAnalysis = extractAspects(text);
    const emotions = detectEmotions(text);
    const keywords = extractKeywords(text);
    
    return {
      ...sentimentAnalysis,
      aspects: aspectAnalysis.aspects,
      detectedAspects: aspectAnalysis.detectedAspects,
      emotions,
      keywords
    };
  } catch (error) {
    console.error('Error analyzing with aspects:', error);
    return {
      sentiment: 'neutral',
      score: 0.5,
      confidence: 0,
      aspects: {},
      detectedAspects: [],
      emotions: {},
      keywords: []
    };
  }
};

/**
 * Analyze reviews with aspect extraction
 * @param {Array} reviews - Array of review objects
 * @returns {Object} - Aggregated sentiment and aspect analysis
 */
const analyzeReviewsWithAspects = (reviews) => {
  try {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return {
        sentiment: 'neutral',
        score: 0.5,
        distribution: {
          'very positive': 0,
          'positive': 0,
          'neutral': 100,
          'negative': 0,
          'very negative': 0
        },
        aspects: {},
        emotions: {},
        keywords: [],
        confidence: 0
      };
    }
    
    // Get overall sentiment
    const overallSentiment = analyzeReviews(reviews);
    
    // Analyze aspects for each review
    const allAspects = {};
    const allEmotions = {};
    const keywordCounts = {};
    
    // Initialize aspect counters
    MOVIE_ASPECTS.forEach(aspect => {
      allAspects[aspect] = {
        mentions: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
        totalScore: 0,
        examples: []
      };
    });
    
    // Initialize emotion counters
    EMOTIONS.forEach(emotion => {
      allEmotions[emotion] = 0;
    });
    
    // Process each review
    reviews.forEach(review => {
      const text = review.comment || review.text || '';
      const analysis = analyzeWithAspects(text);
      
      // Aggregate aspect data
      Object.entries(analysis.aspects).forEach(([aspect, data]) => {
        allAspects[aspect].mentions += data.count;
        allAspects[aspect].totalScore += data.score * data.count;
        
        // Count sentiment categories
        if (data.sentiment.includes('positive')) {
          allAspects[aspect].positiveCount += 1;
        } else if (data.sentiment.includes('negative')) {
          allAspects[aspect].negativeCount += 1;
        } else {
          allAspects[aspect].neutralCount += 1;
        }
        
        // Add examples (up to 5 total)
        if (allAspects[aspect].examples.length < 5 && data.examples) {
          allAspects[aspect].examples.push(...data.examples.slice(0, 5 - allAspects[aspect].examples.length));
        }
      });
      
      // Aggregate emotion data
      Object.entries(analysis.emotions).forEach(([emotion, score]) => {
        allEmotions[emotion] += score;
      });
      
      // Aggregate keywords
      analysis.keywords.forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
    });
    
    // Calculate average scores and percentages for aspects
    const aspectResults = {};
    
    Object.entries(allAspects).forEach(([aspect, data]) => {
      if (data.mentions > 0) {
        const averageScore = data.totalScore / data.mentions;
        const total = data.positiveCount + data.negativeCount + data.neutralCount;
        
        // Determine sentiment category
        let sentiment;
        if (averageScore >= 0.75) {
          sentiment = 'very positive';
        } else if (averageScore >= 0.6) {
          sentiment = 'positive';
        } else if (averageScore >= 0.4) {
          sentiment = 'neutral';
        } else if (averageScore >= 0.25) {
          sentiment = 'negative';
        } else {
          sentiment = 'very negative';
        }
        
        aspectResults[aspect] = {
          sentiment,
          score: averageScore,
          mentions: data.mentions,
          distribution: {
            positive: total > 0 ? Math.round((data.positiveCount / total) * 100) : 0,
            neutral: total > 0 ? Math.round((data.neutralCount / total) * 100) : 0,
            negative: total > 0 ? Math.round((data.negativeCount / total) * 100) : 0
          },
          examples: data.examples
        };
      }
    });
    
    // Normalize emotions
    const normalizedEmotions = {};
    const totalEmotionScore = Object.values(allEmotions).reduce((sum, score) => sum + score, 0);
    
    if (totalEmotionScore > 0) {
      Object.entries(allEmotions).forEach(([emotion, score]) => {
        normalizedEmotions[emotion] = Math.round((score / totalEmotionScore) * 100);
      });
    } else {
      // Default to neutral if no emotions detected
      normalizedEmotions.neutral = 100;
    }
    
    // Sort keywords by frequency
    const sortedKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([keyword, count]) => ({
        keyword,
        count,
        frequency: Math.round((count / reviews.length) * 100)
      }));
    
    return {
      ...overallSentiment,
      aspects: aspectResults,
      emotions: normalizedEmotions,
      keywords: sortedKeywords
    };
  } catch (error) {
    console.error('Error analyzing reviews with aspects:', error);
    return {
      sentiment: 'neutral',
      score: 0.5,
      distribution: {
        'very positive': 0,
        'positive': 0,
        'neutral': 100,
        'negative': 0,
        'very negative': 0
      },
      aspects: {},
      emotions: {},
      keywords: [],
      confidence: 0
    };
  }
};

/**
 * Detect emotions in text
 * @param {string} text - Text to analyze
 * @returns {Object} - Detected emotions with scores
 */
const detectEmotions = (text) => {
  try {
    if (!text || typeof text !== 'string') {
      return {
        joy: 0,
        sadness: 0,
        anger: 0,
        fear: 0,
        surprise: 0,
        disgust: 0,
        anticipation: 0,
        trust: 0
      };
    }
    
    const lowerText = text.toLowerCase();
    
    // Emotion keywords
    const emotionKeywords = {
      joy: ['happy', 'joy', 'delighted', 'pleased', 'glad', 'enjoyable', 'fun', 'entertaining', 'laughed', 'amused'],
      sadness: ['sad', 'depressing', 'heartbreaking', 'melancholy', 'tearful', 'gloomy', 'somber', 'tragic', 'moving', 'emotional'],
      anger: ['angry', 'annoying', 'frustrating', 'irritating', 'outrageous', 'infuriating', 'rage', 'mad', 'hate', 'furious'],
      fear: ['scary', 'frightening', 'terrifying', 'creepy', 'horrifying', 'tense', 'suspenseful', 'afraid', 'fear', 'dread'],
      surprise: ['surprising', 'unexpected', 'shocking', 'twist', 'unpredictable', 'astonishing', 'amazed', 'stunned', 'revelation', 'plot twist'],
      disgust: ['disgusting', 'gross', 'revolting', 'offensive', 'distasteful', 'repulsive', 'vile', 'nauseating', 'unpleasant', 'awful'],
      anticipation: ['anticipated', 'looking forward', 'excited', 'eager', 'awaited', 'hyped', 'promising', 'potential', 'upcoming', 'expected'],
      trust: ['believable', 'authentic', 'realistic', 'credible', 'convincing', 'faithful', 'reliable', 'trustworthy', 'honest', 'genuine']
    };
    
    // Count emotion keywords
    const emotionCounts = {};
    
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      let count = 0;
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
          count += matches.length;
        }
      });
      
      emotionCounts[emotion] = count;
    });
    
    // Normalize to 0-1 range
    const totalCount = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0);
    const emotions = {};
    
    if (totalCount > 0) {
      Object.entries(emotionCounts).forEach(([emotion, count]) => {
        emotions[emotion] = count / totalCount;
      });
    } else {
      // Default to neutral distribution if no emotions detected
      EMOTIONS.forEach(emotion => {
        emotions[emotion] = 1 / EMOTIONS.length;
      });
    }
    
    return emotions;
  } catch (error) {
    console.error('Error detecting emotions:', error);
    return {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      disgust: 0,
      anticipation: 0,
      trust: 0
    };
  }
};

/**
 * Extract keywords from text
 * @param {string} text - Text to analyze
 * @returns {Array} - Extracted keywords
 */
const extractKeywords = (text) => {
  try {
    if (!text || typeof text !== 'string') {
      return [];
    }
    
    // Tokenize text
    const tokens = text.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/); // Split by whitespace
    
    // Remove stopwords
    const stopwords = [
      'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'from',
      'in', 'out', 'with', 'about', 'as', 'into', 'like', 'through', 'after', 'before',
      'between', 'during', 'without', 'of', 'is', 'are', 'was', 'were', 'be', 'been',
      'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall',
      'should', 'can', 'could', 'may', 'might', 'must', 'i', 'you', 'he', 'she', 'it',
      'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our',
      'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'this', 'that', 'these',
      'those', 'am', 'very', 'movie', 'film'
    ];
    
    const filteredTokens = tokens.filter(token => 
      token.length > 2 && !stopwords.includes(token)
    );
    
    // Count token frequencies
    const tokenCounts = {};
    
    filteredTokens.forEach(token => {
      tokenCounts[token] = (tokenCounts[token] || 0) + 1;
    });
    
    // Sort by frequency and get top keywords
    const sortedTokens = Object.entries(tokenCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([token]) => token);
    
    return sortedTokens;
  } catch (error) {
    console.error('Error extracting keywords:', error);
    return [];
  }
};

/**
 * Generate insights from review analysis
 * @param {Array} reviews - Array of review objects
 * @returns {Array} - Generated insights
 */
const generateInsights = (reviews) => {
  try {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return [];
    }
    
    // Analyze reviews with aspects
    const analysis = analyzeReviewsWithAspects(reviews);
    const insights = [];
    
    // Overall sentiment insight
    if (analysis.sentiment) {
      let sentimentInsight = '';
      
      if (analysis.sentiment === 'very positive') {
        sentimentInsight = `Audiences are extremely enthusiastic about this movie, with ${analysis.distribution['very positive'] + analysis.distribution['positive']}% of reviews being positive.`;
      } else if (analysis.sentiment === 'positive') {
        sentimentInsight = `This movie is generally well-received, with ${analysis.distribution['very positive'] + analysis.distribution['positive']}% of reviews being positive.`;
      } else if (analysis.sentiment === 'neutral') {
        sentimentInsight = `Audience reception is mixed, with opinions fairly evenly divided between positive and negative.`;
      } else if (analysis.sentiment === 'negative') {
        sentimentInsight = `The movie has received criticism from many viewers, with ${analysis.distribution['negative'] + analysis.distribution['very negative']}% of reviews being negative.`;
      } else {
        sentimentInsight = `The movie has been poorly received by most viewers, with ${analysis.distribution['negative'] + analysis.distribution['very negative']}% of reviews being negative.`;
      }
      
      insights.push({
        type: 'sentiment',
        text: sentimentInsight
      });
    }
    
    // Aspect insights
    const aspectEntries = Object.entries(analysis.aspects);
    
    if (aspectEntries.length > 0) {
      // Find most positively reviewed aspect
      const positiveAspects = aspectEntries
        .filter(([_, data]) => data.score >= 0.6 && data.mentions >= 3)
        .sort((a, b) => b[1].score - a[1].score);
      
      if (positiveAspects.length > 0) {
        const [aspect, data] = positiveAspects[0];
        insights.push({
          type: 'positive_aspect',
          text: `The ${aspect} is particularly praised, with ${data.distribution.positive}% of mentions being positive.`,
          aspect
        });
      }
      
      // Find most negatively reviewed aspect
      const negativeAspects = aspectEntries
        .filter(([_, data]) => data.score <= 0.4 && data.mentions >= 3)
        .sort((a, b) => a[1].score - b[1].score);
      
      if (negativeAspects.length > 0) {
        const [aspect, data] = negativeAspects[0];
        insights.push({
          type: 'negative_aspect',
          text: `The ${aspect} receives criticism, with ${data.distribution.negative}% of mentions being negative.`,
          aspect
        });
      }
      
      // Find most mentioned aspect
      const mostMentioned = aspectEntries
        .sort((a, b) => b[1].mentions - a[1].mentions)[0];
      
      if (mostMentioned && mostMentioned[1].mentions >= 5) {
        insights.push({
          type: 'most_discussed',
          text: `Audiences frequently discuss the ${mostMentioned[0]}, mentioning it in ${Math.round((mostMentioned[1].mentions / reviews.length) * 100)}% of reviews.`,
          aspect: mostMentioned[0]
        });
      }
    }
    
    // Emotion insights
    if (analysis.emotions) {
      const dominantEmotion = Object.entries(analysis.emotions)
        .sort((a, b) => b[1] - a[1])[0];
      
      if (dominantEmotion && dominantEmotion[1] >= 25) {
        let emotionInsight = '';
        
        switch (dominantEmotion[0]) {
          case 'joy':
            emotionInsight = `This movie evokes happiness and enjoyment in many viewers.`;
            break;
          case 'sadness':
            emotionInsight = `Many viewers find this movie emotionally moving and touching.`;
            break;
          case 'fear':
            emotionInsight = `This movie creates a strong sense of suspense and tension for viewers.`;
            break;
          case 'surprise':
            emotionInsight = `Viewers are often surprised by unexpected elements in this movie.`;
            break;
          case 'anger':
            emotionInsight = `Some viewers express frustration or anger in their reviews.`;
            break;
          case 'disgust':
            emotionInsight = `Some aspects of this movie provoke strong negative reactions.`;
            break;
          case 'anticipation':
            emotionInsight = `This movie creates a sense of anticipation and excitement.`;
            break;
          case 'trust':
            emotionInsight = `Viewers find the movie's portrayal authentic and believable.`;
            break;
          default:
            emotionInsight = `The dominant emotion expressed in reviews is ${dominantEmotion[0]}.`;
        }
        
        insights.push({
          type: 'emotion',
          text: emotionInsight,
          emotion: dominantEmotion[0]
        });
      }
    }
    
    // Keyword insights
    if (analysis.keywords && analysis.keywords.length > 0) {
      const topKeywords = analysis.keywords
        .filter(k => k.frequency >= 15)
        .slice(0, 3)
        .map(k => k.keyword)
        .join(', ');
      
      if (topKeywords) {
        insights.push({
          type: 'keywords',
          text: `Common themes in reviews include: ${topKeywords}.`,
          keywords: topKeywords
        });
      }
    }
    
    return insights;
  } catch (error) {
    console.error('Error generating insights:', error);
    return [];
  }
};

// Export the service
const enhancedSentimentService = {
  analyzeSentiment,
  analyzeReviews,
  analyzeWithAspects,
  analyzeReviewsWithAspects,
  extractAspects,
  detectEmotions,
  extractKeywords,
  generateInsights
};

export default enhancedSentimentService;
