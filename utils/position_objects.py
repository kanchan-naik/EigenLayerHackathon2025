# position_objects.py

class V3LPPosition:
    #TODO: Check if more attributes are needed

    """
    Tracks a single user's concentrated liquidity position:
      - lower_tick, upper_tick: range for this position #TODO: code that lets people put in time/date and get the tick range
      - liquidity: how much liquidity is currently allocated for this range #TODO: Update to v3
      - tokens_owed0, tokens_owed1: fees accrued or leftover from partial liquidity burns
      - fee_growth_inside0_last, fee_growth_inside1_last: for fee accounting
    """

    def __init__(self, lower_tick: int, upper_tick: int):
        self.lower_tick = lower_tick
        self.upper_tick = upper_tick
        self.liquidity = 0.0

        # Fees accrued (uncollected)
        self.tokens_owed0 = 0.0
        self.tokens_owed1 = 0.0

        # Last known "fee growth inside" snapshots, used to compute additional fees
        self.fee_growth_inside0_last = 0.0
        self.fee_growth_inside1_last = 0.0

    def is_in_range(self, current_tick: int) -> bool:
        """
        Returns True if the position's range includes the current_tick.
        """
        return self.lower_tick <= current_tick < self.upper_tick
    
class LPPositionState:

    """
    Tracks the user's broader state, including the initial deposit and total gas spent.
    """

    def __init__(self, initial_token0: float, initial_token1: float):
        self.initial_token0 = initial_token0
        self.initial_token1 = initial_token1
        self.total_gas_spent = 0.0  # in ETH or USD, depending on how you model it

#TODO: Make class containing all LP (and eventually swap/holding) positions + function to aggregate their performance (latter in another file)