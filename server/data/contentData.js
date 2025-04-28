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
    type: 'homepage',
    position: 'hero',
    isActive: true,
    createdBy: '680d29841ad99532cd239b01', // Admin User
    createdAt: fiveDaysAgo,
    updatedAt: yesterday
  },
  {
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
    type: 'feature',
    position: 'main',
    isActive: true,
    createdBy: '680d29841ad99532cd239b01', // Admin User
    createdAt: fourDaysAgo,
    updatedAt: fourDaysAgo
  },
  {
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
    type: 'promotion',
    position: 'sidebar',
    isActive: true,
    createdBy: '680d29841ad99532cd239b01', // Admin User
    createdAt: threeDaysAgo,
    updatedAt: threeDaysAgo
  },
  {
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
    type: 'notice',
    position: 'top',
    isActive: true,
    createdBy: '680d29841ad99532cd239b01', // Admin User
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo
  },
  {
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
    type: 'service',
    position: 'main',
    isActive: true,
    createdBy: '680d29841ad99532cd239b01', // Admin User
    createdAt: yesterday,
    updatedAt: yesterday
  },
  {
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
    type: 'promotion',
    position: 'footer',
    isActive: true,
    createdBy: '680d29841ad99532cd239b01', // Admin User
    createdAt: today,
    updatedAt: today
  },
  {
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
    type: 'event',
    position: 'main',
    isActive: true,
    createdBy: '680d29841ad99532cd239b01', // Admin User
    createdAt: today,
    updatedAt: today
  },
  {
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
    type: 'promotion',
    position: 'sidebar',
    isActive: true,
    createdBy: '680d29841ad99532cd239b01', // Admin User
    createdAt: yesterday,
    updatedAt: yesterday
  },
  {
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
    type: 'information',
    position: 'main',
    isActive: true,
    createdBy: '680d29841ad99532cd239b01', // Admin User
    createdAt: threeDaysAgo,
    updatedAt: threeDaysAgo
  },
  {
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
    type: 'form',
    position: 'footer',
    isActive: true,
    createdBy: '680d29841ad99532cd239b01', // Admin User
    createdAt: fourDaysAgo,
    updatedAt: fourDaysAgo
  }
];

module.exports = contents;
