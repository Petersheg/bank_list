class Account{

    constructor(accNumber,accBalance,movementsDate){
      this.accNumber = accNumber;
      this.accBalance = accBalance;
      this.movementsDate = movementsDate;
    }
  
};
  
export class Maintier extends Account{
  
    constructor(accNumber,accBalance,movementsDate,accType,accInterest,minAmount,maxAmount){
        super(accNumber,accBalance,movementsDate);
        this.accType = accType;
        this.accInterest = accInterest;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
        this.mov = [accBalance];
    }
  
};
  
export class Tier3 extends Maintier{
  
    constructor(accNumber,accBalance,movementsDate,accType,accInterest,minAmount,maxAmount, idenType, idenNumber){
      super(accNumber,accBalance,movementsDate,accType,accInterest,minAmount,maxAmount);
      this.idenType = idenType;
      this.idenNumber = idenNumber;
    }
  
};