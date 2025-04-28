import * as tf from '@tensorflow/tfjs';

// Simple sentiment analysis service
const sentimentService = {
  // Analyze sentiment of a text
  analyzeSentiment: async (text) => {
    try {
      // In a real implementation, this would use a pre-trained model
      // For now, we'll use a simple rule-based approach
      
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
      
      // Convert text to lowercase for case-insensitive matching
      const lowerText = text.toLowerCase();
      
      // Count positive and negative words
      let positiveCount = 0;
      let negativeCount = 0;
      
      // Check for positive words
      positiveWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const matches = lowerText.match(regex);
        if (matches) {
          positiveCount += matches.length;
        }
      });
      
      // Check for negative words
      negativeWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const matches = lowerText.match(regex);
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
      
      // Determine sentiment label
      let sentiment = 'neutral';
      if (sentimentScore > 0.2) {
        sentiment = 'positive';
      } else if (sentimentScore < -0.2) {
        sentiment = 'negative';
      }
      
      // Return sentiment analysis result
      return {
        score: sentimentScore,
        sentiment,
        positive: positiveCount,
        negative: negativeCount,
        total: totalWords
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return {
        score: 0,
        sentiment: 'neutral',
        positive: 0,
        negative: 0,
        total: 0
      };
    }
  },
  
  // Analyze sentiment of multiple reviews
  analyzeReviews: async (reviews) => {
    try {
      // Process each review
      const results = await Promise.all(
        reviews.map(review => sentimentService.analyzeSentiment(review.comment || ''))
      );
      
      // Calculate overall sentiment
      const totalReviews = results.length;
      if (totalReviews === 0) {
        return {
          score: 0,
          sentiment: 'neutral',
          positive: 0,
          negative: 0,
          neutral: 0,
          total: 0
        };
      }
      
      // Count sentiment categories
      const positiveCount = results.filter(r => r.sentiment === 'positive').length;
      const negativeCount = results.filter(r => r.sentiment === 'negative').length;
      const neutralCount = results.filter(r => r.sentiment === 'neutral').length;
      
      // Calculate average sentiment score
      const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalReviews;
      
      // Determine overall sentiment
      let overallSentiment = 'neutral';
      if (averageScore > 0.2) {
        overallSentiment = 'positive';
      } else if (averageScore < -0.2) {
        overallSentiment = 'negative';
      }
      
      // Return overall sentiment analysis
      return {
        score: averageScore,
        sentiment: overallSentiment,
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount,
        total: totalReviews
      };
    } catch (error) {
      console.error('Error analyzing reviews:', error);
      return {
        score: 0,
        sentiment: 'neutral',
        positive: 0,
        negative: 0,
        neutral: 0,
        total: 0
      };
    }
  },
  
  // Get sentiment color
  getSentimentColor: (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  },
  
  // Get sentiment icon
  getSentimentIcon: (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return '😃';
      case 'negative':
        return '😞';
      default:
        return '😐';
    }
  }
};

export default sentimentService;
