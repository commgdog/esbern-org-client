<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        md="4"
      >
        <DashboardTotalRequestCount />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <DashboardTotalRequestDuration />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <DashboardTotalSessionCount />
      </v-col>
    </v-row>
  </v-container>
</template>
