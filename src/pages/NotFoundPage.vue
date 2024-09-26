<template>
  <v-empty-state
    action-text="Return to home page"
    title="Page not found"
    text="The page you were looking for does not exist"
  >
    <template #media>
      <v-img
        src="/page_not_found.svg"
        height="150"
        class="my-3"
      />
    </template>
    <template #actions>
      <v-btn
        variant="text"
        append-icon="mdi-open-in-new"
        to="/"
      >
        Return to home page
      </v-btn>
    </template>
  </v-empty-state>
</template>
