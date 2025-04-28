const mongoose = require('mongoose');

// Get current date
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
const fourDaysAgo = new Date(today);
fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
const fiveDaysAgo = new Date(today);
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

// Create content data
const contents = [
  {
    type: 'page',
    title: 'Welcome to Our Cinema',
    slug: 'welcome-message',
    content: `
      <div class="welcome-message">
        <h1>Welcome to Our Cinema</h1>
        <p>Experience the magic of movies in ultimate comfort and with state-of-the-art technology.</p>
        <p>From blockbuster premieres to indie gems, we bring you the best cinematic experiences.</p>
        <div class="cta-buttons">
          <a href="/movies" class="btn btn-primary">Browse Movies</a>
          <a href="/theaters" class="btn btn-secondary">Our Theaters</a>
        </div>
      </div>
    `,
    summary: 'Welcome to our cinema website. Experience the magic of movies in ultimate comfort.',
    image: '/images/welcome-banner.jpg',
    status: 'published',
    author: '680d29841ad99532cd239b01', // Admin User
    publishedAt: fiveDaysAgo,
    order: 1,
    parent: null,
    metadata: {
      seoTitle: 'Welcome to Our Cinema - The Best Movie Experience',
      seoDescription: 'Experience the magic of movies in ultimate comfort with state-of-the-art technology.',
      seoKeywords: 'cinema, movies, theater, film, entertainment'
    },
    settings: {
      showInNavigation: true,
      showInFooter: false
    }
  },
  {
    type: 'section',
    title: 'About Our IMAX Experience',
    slug: 'imax-experience',
    content: `
      <div class="feature-section">
        <h2>Experience Movies in IMAX</h2>
        <p>Our IMAX theaters offer the most immersive movie experience available today. With crystal-clear images, powerful digital sound, and a larger, curved screen, IMAX is the ultimate way to see a film.</p>
        <ul class="feature-list">
          <li>Screens up to 40% larger than standard theaters</li>
          <li>Dual 4K projection systems for incredible clarity</li>
          <li>12-channel sound system for immersive audio</li>
          <li>Custom theater design for optimal viewing</li>
        </ul>
        <a href="/theaters?feature=imax" class="btn btn-feature">Find IMAX Theaters</a>
      </div>
    `,
    summary: 'Learn about our state-of-the-art IMAX theaters and what makes them special.',
    image: '/images/imax-theater.jpg',
    status: 'published',
    author: '680d29841ad99532cd239b01', // Admin User
    publishedAt: fourDaysAgo,
    order: 2,
    parent: null,
    metadata: {
      seoTitle: 'IMAX Experience - The Ultimate Way to Watch Movies',
      seoDescription: 'Our IMAX theaters offer the most immersive movie experience with crystal-clear images and powerful sound.',
      seoKeywords: 'IMAX, movie experience, big screen, surround sound, immersive'
    },
    settings: {
      backgroundColor: '#000000',
      textColor: '#ffffff'
    }
  },
  {
    type: 'promotion',
    title: 'Membership Benefits',
    slug: 'membership-benefits',
    content: `
      <div class="membership-section">
        <h2>Join Our Membership Program</h2>
        <p>Become a member today and enjoy exclusive benefits that enhance your movie-going experience.</p>
        <div class="benefits-grid">
          <div class="benefit-card">
            <i class="fa-solid fa-ticket"></i>
            <h3>Discounted Tickets</h3>
            <p>Save up to 20% on regular ticket prices.</p>
          </div>
          <div class="benefit-card">
            <i class="fa-solid fa-popcorn"></i>
            <h3>Concession Deals</h3>
            <p>Get special combo offers and free upgrades.</p>
          </div>
          <div class="benefit-card">
            <i class="fa-solid fa-calendar"></i>
            <h3>Early Access</h3>
            <p>Book tickets for premieres before general release.</p>
          </div>
          <div class="benefit-card">
            <i class="fa-solid fa-gift"></i>
            <h3>Birthday Rewards</h3>
            <p>Receive a free ticket during your birthday month.</p>
          </div>
        </div>
        <a href="/membership" class="btn btn-primary">Join Now</a>
      </div>
    `,
    summary: 'Join our membership program and enjoy exclusive benefits like discounted tickets and special offers.',
    image: '/images/membership-card.jpg',
    status: 'published',
    author: '680d29841ad99532cd239b01', // Admin User
    publishedAt: threeDaysAgo,
    order: 3,
    parent: null,
    metadata: {
      seoTitle: 'Cinema Membership Benefits - Join Today',
      seoDescription: 'Join our membership program and enjoy exclusive benefits like discounted tickets and special offers.',
      seoKeywords: 'cinema membership, movie discounts, loyalty program, benefits'
    },
    settings: {
      expiryDate: new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()),
      promoCode: 'MEMBER20'
    }
  },
  {
    type: 'block',
    title: 'COVID-19 Safety Measures',
    slug: 'covid-safety',
    content: `
      <div class="safety-notice">
        <h2>Your Safety is Our Priority</h2>
        <p>We have implemented comprehensive safety measures to ensure you can enjoy movies with peace of mind.</p>
        <ul class="safety-measures">
          <li>Enhanced cleaning protocols between screenings</li>
          <li>Improved air filtration systems in all theaters</li>
          <li>Contactless ticket purchase and concession ordering</li>
          <li>Hand sanitizing stations throughout our facilities</li>
          <li>Reduced capacity seating for appropriate distancing</li>
        </ul>
        <p>Thank you for your cooperation in maintaining a safe environment for everyone.</p>
        <a href="/safety" class="btn btn-info">Learn More</a>
      </div>
    `,
    summary: 'Learn about the safety measures we have implemented to ensure your safety during your visit.',
    image: '/images/safety-measures.jpg',
    status: 'published',
    author: '680d29841ad99532cd239b01', // Admin User
    publishedAt: twoDaysAgo,
    order: 4,
    parent: null,
    metadata: {
      seoTitle: 'COVID-19 Safety Measures at Our Cinema',
      seoDescription: 'Learn about the comprehensive safety measures we have implemented to ensure your safety during your visit.',
      seoKeywords: 'COVID safety, cinema safety, health measures, safe entertainment'
    },
    settings: {
      backgroundColor: '#f8f9fa',
      borderColor: '#007bff',
      showOnAllPages: true
    }
  },
  {
    type: 'page',
    title: 'Private Screenings',
    slug: 'private-screenings',
    content: `
      <div class="private-screenings">
        <h2>Book a Private Screening</h2>
        <p>Make your next celebration unforgettable with a private movie screening for you and your guests.</p>
        <div class="occasions">
          <div class="occasion">
            <h3>Birthday Parties</h3>
            <p>Celebrate your special day with friends and family watching your favorite movie.</p>
          </div>
          <div class="occasion">
            <h3>Corporate Events</h3>
            <p>Impress clients or reward your team with an exclusive cinema experience.</p>
          </div>
          <div class="occasion">
            <h3>School Outings</h3>
            <p>Educational and entertaining field trips for students of all ages.</p>
          </div>
        </div>
        <div class="pricing">
          <h3>Packages Starting From $299</h3>
          <p>Includes theater rental, movie screening, and basic concessions.</p>
        </div>
        <a href="/private-events" class="btn btn-primary">Inquire Now</a>
      </div>
    `,
    summary: 'Book a private screening for your next celebration or event. Packages starting from $299.',
    image: '/images/private-screening.jpg',
    status: 'published',
    author: '680d29841ad99532cd239b01', // Admin User
    publishedAt: yesterday,
    order: 5,
    parent: null,
    metadata: {
      seoTitle: 'Private Movie Screenings - Book Your Event',
      seoDescription: 'Book a private screening for your next celebration or event. Perfect for birthdays, corporate events, and school outings.',
      seoKeywords: 'private screening, movie party, cinema rental, event venue'
    },
    settings: {
      showContactForm: true,
      showPricing: true
    }
  },
  {
    type: 'promotion',
    title: 'Download Our Mobile App',
    slug: 'mobile-app',
    content: `
      <div class="app-promotion">
        <h2>Cinema at Your Fingertips</h2>
        <p>Download our mobile app for the ultimate convenience:</p>
        <ul class="app-features">
          <li>Book tickets in seconds</li>
          <li>Skip the line with mobile tickets</li>
          <li>Manage your membership</li>
          <li>Receive exclusive app-only offers</li>
          <li>Rate and review movies</li>
        </ul>
        <div class="app-buttons">
          <a href="#" class="app-button">
            <img src="/images/app-store.png" alt="Download on App Store">
          </a>
          <a href="#" class="app-button">
            <img src="/images/google-play.png" alt="Get it on Google Play">
          </a>
        </div>
      </div>
    `,
    summary: 'Download our mobile app for the ultimate convenience. Book tickets, skip the line, and more.',
    image: '/images/mobile-app.jpg',
    status: 'published',
    author: '680d29841ad99532cd239b01', // Admin User
    publishedAt: today,
    order: 6,
    parent: null,
    metadata: {
      seoTitle: 'Cinema Mobile App - Book Tickets on the Go',
      seoDescription: 'Download our mobile app for the ultimate convenience. Book tickets, skip the line, and more.',
      seoKeywords: 'cinema app, movie tickets, mobile booking, digital tickets'
    },
    settings: {
      appStoreUrl: 'https://apps.apple.com/app/cinema',
      playStoreUrl: 'https://play.google.com/store/apps/cinema',
      promoCode: 'APP10'
    }
  },
  {
    type: 'page',
    title: 'Summer Movie Festival',
    slug: 'summer-festival',
    content: `
      <div class="festival-announcement">
        <h2>Summer Movie Festival 2023</h2>
        <p class="dates">July 15 - August 15</p>
        <p class="description">Join us for a month-long celebration of cinema featuring classic favorites, family films, and blockbuster hits!</p>
        <div class="festival-highlights">
          <div class="highlight">
            <h3>Marvel Marathon</h3>
            <p>All MCU films back-to-back over one epic weekend.</p>
            <p class="date">July 15-17</p>
          </div>
          <div class="highlight">
            <h3>Family Week</h3>
            <p>Kid-friendly movies with special activities before each showing.</p>
            <p class="date">July 22-28</p>
          </div>
          <div class="highlight">
            <h3>Oscar Winners Showcase</h3>
            <p>The best Best Picture winners from the last decade.</p>
            <p class="date">August 1-7</p>
          </div>
          <div class="highlight">
            <h3>Sci-Fi Spectacular</h3>
            <p>Out-of-this-world adventures on the big screen.</p>
            <p class="date">August 8-15</p>
          </div>
        </div>
        <p class="special-offer">Special Festival Pass: $99 for unlimited screenings!</p>
        <a href="/summer-festival" class="btn btn-festival">View Full Schedule</a>
      </div>
    `,
    summary: 'Join us for our Summer Movie Festival 2023, featuring classic favorites, family films, and blockbuster hits.',
    image: '/images/summer-festival.jpg',
    status: 'published',
    author: '680d29841ad99532cd239b01', // Admin User
    publishedAt: today,
    order: 7,
    parent: null,
    metadata: {
      seoTitle: 'Summer Movie Festival 2023 - A Month of Cinema',
      seoDescription: 'Join us for a month-long celebration of cinema featuring classic favorites, family films, and blockbuster hits!',
      seoKeywords: 'movie festival, summer movies, film marathon, cinema event'
    },
    settings: {
      eventStartDate: new Date(2023, 6, 15), // July 15, 2023
      eventEndDate: new Date(2023, 7, 15), // August 15, 2023
      showSchedule: true
    }
  },
  {
    type: 'promotion',
    title: 'Gift Cards',
    slug: 'gift-cards',
    content: `
      <div class="gift-cards">
        <h2>The Perfect Gift for Movie Lovers</h2>
        <p>Give the gift of entertainment with our cinema gift cards.</p>
        <div class="gift-card-options">
          <div class="gift-card">
            <img src="/images/gift-card-standard.jpg" alt="Standard Gift Card">
            <h3>Standard Gift Card</h3>
            <p>Available in $25, $50, and $100 denominations.</p>
          </div>
          <div class="gift-card">
            <img src="/images/gift-card-premium.jpg" alt="Premium Gift Card">
            <h3>Premium Experience Card</h3>
            <p>Includes tickets and concessions for a complete movie night.</p>
            <p class="price">$75</p>
          </div>
          <div class="gift-card">
            <img src="/images/gift-card-digital.jpg" alt="Digital Gift Card">
            <h3>Digital Gift Card</h3>
            <p>Sent instantly via email. Perfect for last-minute gifts.</p>
            <p>Any amount from $10 to $200</p>
          </div>
        </div>
        <div class="gift-card-features">
          <p>All gift cards are:</p>
          <ul>
            <li>Valid for 12 months from purchase</li>
            <li>Redeemable online or at the box office</li>
            <li>Can be used for tickets and concessions</li>
          </ul>
        </div>
        <a href="/gift-cards" class="btn btn-primary">Purchase Gift Cards</a>
      </div>
    `,
    summary: 'Give the gift of entertainment with our cinema gift cards. Available in physical and digital formats.',
    image: '/images/gift-cards.jpg',
    status: 'published',
    author: '680d29841ad99532cd239b01', // Admin User
    publishedAt: yesterday,
    order: 8,
    parent: null,
    metadata: {
      seoTitle: 'Cinema Gift Cards - The Perfect Gift for Movie Lovers',
      seoDescription: 'Give the gift of entertainment with our cinema gift cards. Available in physical and digital formats.',
      seoKeywords: 'gift cards, movie gift, cinema present, digital gift card'
    },
    settings: {
      showPurchaseOptions: true,
      giftWrapAvailable: true
    }
  },
  {
    type: 'page',
    title: 'Concession Menu',
    slug: 'concession-menu',
    content: `
      <div class="concession-menu">
        <h2>Movie Snacks & Refreshments</h2>
        <p>Enhance your movie experience with our delicious offerings.</p>
        
        <div class="menu-section">
          <h3>Popcorn</h3>
          <div class="menu-items">
            <div class="menu-item">
              <h4>Small Popcorn</h4>
              <p class="price">$5.99</p>
            </div>
            <div class="menu-item">
              <h4>Medium Popcorn</h4>
              <p class="price">$7.99</p>
            </div>
            <div class="menu-item">
              <h4>Large Popcorn</h4>
              <p class="price">$8.99</p>
              <p class="note">Free refills!</p>
            </div>
          </div>
        </div>
        
        <div class="menu-section">
          <h3>Drinks</h3>
          <div class="menu-items">
            <div class="menu-item">
              <h4>Small Soda</h4>
              <p class="price">$3.99</p>
            </div>
            <div class="menu-item">
              <h4>Medium Soda</h4>
              <p class="price">$4.99</p>
            </div>
            <div class="menu-item">
              <h4>Large Soda</h4>
              <p class="price">$5.99</p>
              <p class="note">Free refills!</p>
            </div>
            <div class="menu-item">
              <h4>Bottled Water</h4>
              <p class="price">$3.50</p>
            </div>
          </div>
        </div>
        
        <div class="menu-section">
          <h3>Snacks</h3>
          <div class="menu-items">
            <div class="menu-item">
              <h4>Nachos</h4>
              <p class="price">$7.99</p>
            </div>
            <div class="menu-item">
              <h4>Hot Dog</h4>
              <p class="price">$6.99</p>
            </div>
            <div class="menu-item">
              <h4>Candy</h4>
              <p class="price">$3.99</p>
            </div>
            <div class="menu-item">
              <h4>Pretzel Bites</h4>
              <p class="price">$5.99</p>
            </div>
          </div>
        </div>
        
        <div class="menu-section">
          <h3>Combo Deals</h3>
          <div class="menu-items">
            <div class="menu-item">
              <h4>Small Combo</h4>
              <p>Small Popcorn + Small Drink</p>
              <p class="price">$8.99</p>
            </div>
            <div class="menu-item">
              <h4>Medium Combo</h4>
              <p>Medium Popcorn + Medium Drink</p>
              <p class="price">$11.99</p>
            </div>
            <div class="menu-item">
              <h4>Large Combo</h4>
              <p>Large Popcorn + Large Drink + Candy</p>
              <p class="price">$15.99</p>
            </div>
            <div class="menu-item">
              <h4>Family Combo</h4>
              <p>2 Large Popcorns + 4 Medium Drinks + 2 Candies</p>
              <p class="price">$29.99</p>
            </div>
          </div>
        </div>
        
        <p class="allergy-info">Please inform our staff of any allergies or dietary restrictions.</p>
      </div>
    `,
    summary: 'Explore our concession menu featuring popcorn, drinks, snacks, and combo deals.',
    image: '/images/concessions.jpg',
    status: 'published',
    author: '680d29841ad99532cd239b01', // Admin User
    publishedAt: threeDaysAgo,
    order: 9,
    parent: null,
    metadata: {
      seoTitle: 'Cinema Concession Menu - Movie Snacks & Refreshments',
      seoDescription: 'Explore our concession menu featuring popcorn, drinks, snacks, and combo deals to enhance your movie experience.',
      seoKeywords: 'movie snacks, cinema food, popcorn, concessions, combo deals'
    },
    settings: {
      showPrices: true,
      showAllergyInfo: true
    }
  },
  {
    type: 'block',
    title: 'Newsletter Signup',
    slug: 'newsletter-signup',
    content: `
      <div class="newsletter-signup">
        <h3>Stay Updated</h3>
        <p>Subscribe to our newsletter for the latest movie releases, special promotions, and exclusive events.</p>
        <form class="signup-form">
          <div class="form-group">
            <input type="text" placeholder="Your Name" required>
          </div>
          <div class="form-group">
            <input type="email" placeholder="Your Email" required>
          </div>
          <div class="form-group checkbox">
            <input type="checkbox" id="promo-consent">
            <label for="promo-consent">I agree to receive promotional emails</label>
          </div>
          <button type="submit" class="btn btn-subscribe">Subscribe</button>
        </form>
        <p class="privacy-note">We respect your privacy. Unsubscribe at any time.</p>
      </div>
    `,
    summary: 'Subscribe to our newsletter for the latest movie releases, special promotions, and exclusive events.',
    image: null,
    status: 'published',
    author: '680d29841ad99532cd239b01', // Admin User
    publishedAt: fourDaysAgo,
    order: 10,
    parent: null,
    metadata: {
      seoTitle: 'Subscribe to Our Cinema Newsletter',
      seoDescription: 'Stay updated with the latest movie releases, special promotions, and exclusive events by subscribing to our newsletter.',
      seoKeywords: 'cinema newsletter, movie updates, film promotions, subscribe'
    },
    settings: {
      formAction: '/api/newsletter/subscribe',
      formMethod: 'POST',
      showOnAllPages: true
    }
  }
];

module.exports = contents;
