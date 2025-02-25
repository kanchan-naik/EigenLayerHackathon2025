# market_data_objects.py

class V3PoolState:
    """
    Tracks the essential state of a Uniswap V3 pool at a moment in time:
      - sqrt_price (float): the current sqrt(price), typically in Q96 format or a float approximation
      - current_tick (int): the current tick
      - liquidity (float): total liquidity active at the current tick
      - fee_growth_global0 (float): global fee growth for token0
      - fee_growth_global1 (float): global fee growth for token1
      - fee_tier (float): e.g., 0.003 for 0.3%, 0.0005 for 0.05%, etc.
    """

    def __init__(self,
                 sqrt_price: float,
                 current_tick: int,
                 liquidity: float,
                 fee_growth_global0: float,
                 fee_growth_global1: float,
                 fee_tier: float = 0.003):
        self.sqrt_price = sqrt_price
        self.current_tick = current_tick
        self.liquidity = liquidity
        self.fee_growth_global0 = fee_growth_global0
        self.fee_growth_global1 = fee_growth_global1
        self.fee_tier = fee_tier

        #TODO: Need more attributes to properly backtest? confirm
        #TODO: Connect to Kanchan's code that gets data


class TradeData:
    """
    Represents a single trade (swap) in the Uniswap V3 pool.
    For real usage, you'll include everything needed to fully simulate
    how the swap changes the pool (price, liquidity, etc.).
    """

    def __init__(self,
                 block_number: int,
                 sqrt_price_after: float,
                 liquidity_after: float,
                 amount0_in: float,
                 amount0_out: float,
                 amount1_in: float,
                 amount1_out: float,
                 tick_after: int):
        self.block_number = block_number
        self.sqrt_price_after = sqrt_price_after
        self.liquidity_after = liquidity_after
        self.amount0_in = amount0_in
        self.amount0_out = amount0_out
        self.amount1_in = amount1_in
        self.amount1_out = amount1_out
        self.tick_after = tick_after

        #TODO: Need more attributes to properly backtest? confirm
        #TODO: Connect to Kanchan's code that gets data
