<script lang="ts">
  import logo from "src/assets/icons/icon128.png";
  import Settings from "src/components/Settings.svelte";
</script>

<div class="wrapper">
  <div class="header">
    <img width="50px" src={logo} alt="logo" />
    <div>
      <h1 class="title">ChatGuard</h1>
      <p class="slogan">safe way to chat</p>
    </div>
  </div>
  <Settings />
  <p class="info"
    ><span class="error">warning</span>
    : when you export your config its important to keep it in the safe place its containing your private key that can decrypt
    the messages
  </p>
</div>

<style lang="scss" module>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :global(body) {
    background-color: #ffffff;
    color: #111217;
  }

  .wrapper {
    padding: 2rem;
    width: 24rem;
    display: flex;
    flex-direction: column;
    font-size: 1.2rem;
    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      .title {
        font-size: 1.5rem;
      }
      .slogan {
        opacity: 0.7;
        padding-left: 0.2rem;
        font-size: 0.8rem;
      }
    }
    .info {
      text-align: center;
      margin-top: 2rem;
      font-size: 0.8rem;
      opacity: 0.7;
      .error {
        color: red;
      }
    }
  }
</style>
