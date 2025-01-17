<template>
  <v-container style="max-width: 1000px">
    <div class="d-flex flex-column flex-sm-row align-center align-sm-start mb-4">
      <v-img
        src="/pizza.png"
        width="200"
        class="flex-grow-0 mr-0 mr-sm-4"
      />
      <div class="d-flex flex-column">
        <h1 class="d-flex justify-center justify-sm-start">
          Grant Martin
        </h1>
        <div class="d-flex font-weight-light mb-2">
          <v-icon
            icon="mdi-map-marker"
            class="text-medium-emphasis mr-2"
          />
          <span>San Fransisco Bay Area, CA, USA</span>
        </div>
        <div class="d-flex font-weight-light mb-2">
          <v-icon
            icon="mdi-domain"
            class="text-medium-emphasis mr-2"
          />
          <a
            href="https://github.com/omni-order"
            class="text-decoration-none text-indigo"
          >
            <span>Omni Order</span>
          </a>
        </div>
        <div class="d-flex font-weight-light mb-2">
          <v-icon
            icon="mdi-email"
            class="text-medium-emphasis mr-2"
          />
          <a
            href="mailto:commgdog@gmail.com"
            class="text-decoration-none text-indigo"
          >
            <span>commgdog@gmail.com</span>
          </a>
        </div>
        <div class="d-flex font-weight-light mb-2">
          <v-icon
            icon="mdi-github"
            class="text-medium-emphasis mr-2"
          />
          <a
            href="https://github.com/commgdog"
            class="text-decoration-none text-indigo"
          >
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
    <v-divider />
    <h3 class="mt-4">
      About Me
    </h3>
    <p class="mb-3">
      I'm a software developer based in the San Francisco Bay Area, specializing in retail IT systems and compliance.
      With a focus on streamlining operations, I help businesses drive growth through tailored technology solutions.
    </p>
    <h3 class="mt-4">
      Current Role
    </h3>
    <p class="mb-3">
      Since 2019, I’ve partnered with Walnut Creek Hardware to develop <strong>OmniOrder</strong>, an order management
      add-on designed specifically for Ace Hardware retail stores. As the principal developer, I oversee its ongoing
      development and optimization, continually enhancing its features to support seamless retail operations.
    </p>
    <h3 class="mt-4">
      Previous Experience
    </h3>
    <p class="mb-3">
      From 2014 to 2019, I worked as a freelance IT consultant within the hardlines retail industry. During this time, I
      delivered custom software solutions, managed systems, and implemented IT and network infrastructure to enable
      efficient business operations.
    </p>
    <p class="mb-3">
      Before that, from 2009 to 2012, I held various roles at Walnut Creek Hardware, ranging from stocking shelves and
      driving delivery trucks to spearheading marketing initiatives. This hands-on experience in the hardlines retail
      industry provided me with a deep understanding of how technology can enhance efficiency and improve the customer
      experience.
    </p>
    <h3 class="mt-4">
      Hobbies
    </h3>
    <p class="mb-3">
      In my free time, I'm an avid kayak fisherman, handyman, gardener, and pottery enthusiast.
    </p>
    <v-divider />
    <h3 class="my-4">
      Technologies I work with daily:
    </h3>
    <ul class="ml-8">
      <li>AWS (EC2, VPC, S3, Route 53)</li>
      <li>PHP / LAMP Stack</li>
      <li>TypeScript / JavaScript / Node.js / Electron</li>
      <li>MySQL / MariaDB</li>
      <li>Vue.js / Vuetify</li>
      <li>Git / JetBrains / SSH</li>
    </ul>
    <h3 class="my-4">
      Areas of Expertise:
    </h3>
    <ul class="ml-8">
      <li>Order and Fulfillment Management</li>
      <li>Inventory Management / ERP</li>
      <li>Network Design and Implementation</li>
      <li>Linux and Windows System Administration</li>
      <li>Epicor Eagle</li>
      <li>Stripe</li>
      <li>PCI Compliance</li>
      <li>Web Scraping & Reverse Engineering</li>
      <li>Hardlines Retail</li>
    </ul>
    <h3 class="my-4">
      This site is open source!
    </h3>
    <ul class="ml-8">
      <li><a href="https://github.com/commgdog/esbern-org-client">Client project GitHub</a></li>
      <li><a href="https://github.com/commgdog/esbern-org-server">Server project GitHub</a></li>
    </ul>
  </v-container>
</template>
<script setup lang="ts">
</script>
