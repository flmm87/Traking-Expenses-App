import { StyleSheet, View, Text, Alert } from "react-native";
import Input from "./Input";
import { useState } from "react";
import Buttons from "../UI/Buttons";
import { getFormattedDate } from "../../utils/date";
import { GlobalStyles } from "../../constants/style";

function ExpenseForm({ onCancel, onSubmit, submitButtonLabel, defaultValues }) {
  const [inputs, setInputs] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : "",
      isValid: true,
    },
    date: {
      value: defaultValues ? getFormattedDate(defaultValues.date) : "",
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : "",
      isValid: true,
    },
  });

  function inputChangeHandler(inputIdentifier, enteredValue) {
    setInputs((currInputs) => {
      return {
        ...currInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function submitHandler() {
    const inputsData = {
      amount: +inputs.amount.value,
      date: new Date(inputs.date.value),
      description: inputs.description.value,
    };

    // Validation Inputs
    const isAmountValid = !isNaN(inputsData.amount) && inputsData.amount > 0;
    const isDateValid = inputsData.date.toString() !== "Invalid Date";
    const isDescriptionValid = inputsData.description.trim().length > 0;

    //Adding some feedback to validation and retunr if one of the above condition is false

    if (!isAmountValid || !isDateValid || !isDescriptionValid) {
      // adding visible feedback (ALert)
      //   Alert.alert("Invalid Input", "Please check your input values");
      setInputs((currInput) => {
        return {
          amount: { value: currInput.amount.value, isValid: isAmountValid },
          date: { value: currInput.date.value, isValid: isDateValid },
          description: {
            value: currInput.description.value,
            isValid: isDescriptionValid,
          },
        };
      });
      return;
    }

    onSubmit(inputsData);
  }

  const formIsInvalid =
    !inputs.amount.isValid ||
    !inputs.date.isValid ||
    !inputs.description.isValid;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your Expense</Text>
      <View style={styles.dateAmountContainer}>
        <Input
          label="Amount"
          invalid={!inputs.amount.isValid}
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangeHandler.bind(this, "amount"),
            value: inputs.amount.value,
          }}
          style={styles.rowInput}
        />
        <Input
          label="Date"
          invalid={!inputs.date.isValid}
          textInputConfig={{
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            onChangeText: inputChangeHandler.bind(this, "date"),
            value: inputs.date.value,
          }}
          style={styles.rowInput}
        />
      </View>
      <Input
        label="description"
        invalid={!inputs.description.isValid}
        textInputConfig={{
          multiline: true,
          autoCapitalize: "none",
          onChangeText: inputChangeHandler.bind(this, "description"),
          value: inputs.description.value,
        }}
      />
      {formIsInvalid && (
        <Text style={styles.errorText}>
          Invalid inputs, please check your data.
        </Text>
      )}
      <View style={styles.buttonsContainer}>
        <Buttons style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </Buttons>
        <Buttons style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Buttons>
      </View>
    </View>
  );
}

export default ExpenseForm;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginVertical: 24,
  },
  form: {
    marginTop: 40,
  },
  dateAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInput: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 16,
  },
});
