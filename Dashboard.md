<script>
 import * as Empty from "$lib/components/ui/empty/index.js";
 import CreditCard from "@lucide/svelte/icons/credit-card"
 import { Button } from "$lib/components/ui/button/index.js";
</script>

<h1 class="text-2xl font-semibold">Welcome Back, NAME</h1>

<!-- Your actual dashboard content goes here.
     The sidebar, Sidebar.Provider, and Sidebar.Trigger
     are already provided by +layout.svelte — don't repeat them here. -->

<Empty.Root>
 <Empty.Header>
  <Empty.Media variant="icon">
   <CreditCard />
  </Empty.Media>
  <Empty.Title>No data</Empty.Title>
  <Empty.Description>No data found</Empty.Description>
 </Empty.Header>
 <Empty.Content>
  <Button>Add data</Button>
 </Empty.Content>
</Empty.Root>