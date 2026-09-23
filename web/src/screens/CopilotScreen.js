import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors } from "../theme/colors";
import { calculateFinancialState } from "../engine/financial-engine";
import { formatCurrency } from "../data/sampleData";

export default function CopilotScreen({ transactions }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your ArthSetu financial copilot. Ask me anything about your Safe-to-Save, allocations, or financial decisions. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const financialState = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const essentialExpenses = expenses
      .filter(
        (t) =>
          t.category &&
          ["food", "transport", "rent", "utilities", "work_expense"].includes(
            t.category.toLowerCase()
          )
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return calculateFinancialState({
      currentCash: 5000,
      todayIncome: 1500,
      transactions,
      obligations: [],
      emergencyReserve: 8500,
      goals: [],
      essentialExpenses: Math.round(essentialExpenses) || 650,
      monthlyEssentialTarget: 15000,
    });
  }, [transactions]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Generate AI response based on financial state
  const generateResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    // Safe-to-Save queries
    if (
      msg.includes("safe to save") ||
      msg.includes("safe-to-save") ||
      msg.includes("how much can i save")
    ) {
      return `Your Safe-to-Save today is ₹${formatCurrency(
        financialState.safeToAllocate
      )}. This is the amount you can comfortably allocate after accounting for your essential expenses, emergency buffer, and income volatility. ${
        financialState.aiExplanation
      }`;
    }

    // Affordability queries
    if (
      msg.includes("afford") ||
      msg.includes("can i buy") ||
      msg.includes("purchase")
    ) {
      const purchaseMatch = userMessage.match(/₹?(\d+)/);
      if (purchaseMatch) {
        const amount = Number(purchaseMatch[1]);
        const canAfford = amount <= financialState.safeToAllocate;
        return `${canAfford ? "✅ Yes" : "❌ No"}, you ${
          canAfford ? "can" : "cannot"
        } safely afford ₹${formatCurrency(
          amount
        )}. Your Safe-to-Save is ₹${formatCurrency(
          financialState.safeToAllocate
        )}, which means you have ₹${formatCurrency(
          Math.max(0, financialState.safeToAllocate - amount)
        )} remaining after this purchase.`;
      }
      return `You can safely spend up to ₹${formatCurrency(
        financialState.safeToAllocate
      )} today. What are you thinking about buying?`;
    }

    // Emergency buffer queries
    if (
      msg.includes("emergency") ||
      msg.includes("buffer") ||
      msg.includes("safety net")
    ) {
      return `Your emergency buffer can cover ${
        financialState.emergency.daysCovered
      } days of essential expenses. Your current status is "${
        financialState.emergency.status
      }". To reach the healthy target of 3 months, you need ₹${formatCurrency(
        Math.max(
          0,
          financialState.emergency.targetReserve -
            financialState.emergency.currentReserve
        )
      )} more.`;
    }

    // Income volatility queries
    if (
      msg.includes("income") ||
      msg.includes("volatile") ||
      msg.includes("variability") ||
      msg.includes("average")
    ) {
      return `Your income shows ${
        financialState.volatility.score
      } volatility with an average daily income of ₹${formatCurrency(
        financialState.volatility.averageDailyIncome
      )}. Today's income of ₹${formatCurrency(financialState.todayIncome)} is ${
        financialState.todayIncome >=
        financialState.volatility.averageDailyIncome
          ? "above"
          : "below"
      } average. This affects how conservative your Safe-to-Save allocation is.`;
    }

    // Allocation breakdown
    if (
      msg.includes("allocat") ||
      msg.includes("where should") ||
      msg.includes("how to split")
    ) {
      if (financialState.guardrailActive) {
        return `Due to your emergency buffer status, I'm recommending you allocate all ₹${formatCurrency(
          financialState.safeToAllocate
        )} to your emergency reserve. ${financialState.guardrailReason}`;
      }
      return `Here's your recommended allocation for ₹${formatCurrency(
        financialState.safeToAllocate
      )}:\n\n🏦 Emergency Reserve: ₹${formatCurrency(
        financialState.smartSplit.emergencySavings
      )}\n🎯 Goal Savings: ₹${formatCurrency(
        financialState.smartSplit.goalSavings
      )}\n💼 Micro Investment: ₹${formatCurrency(
        financialState.smartSplit.microInvestment
      )}\n💳 Flexible Buffer: ₹${formatCurrency(
        financialState.smartSplit.flexibleBuffer
      )}`;
    }

    // Financial health
    if (
      msg.includes("health") ||
      msg.includes("score") ||
      msg.includes("how am i doing")
    ) {
      return `Your Financial Safety Score is ${
        financialState.safetyScore
      }/100. This means your financial health is ${
        financialState.safetyScore >= 70
          ? "✅ healthy"
          : financialState.safetyScore >= 40
          ? "⚠️ caution"
          : "🚨 critical"
      }. This score reflects your emergency buffer strength, income stability, and ability to safely allocate funds.`;
    }

    // Expenses
    if (
      msg.includes("expense") ||
      msg.includes("spending") ||
      msg.includes("cost")
    ) {
      return `Your essential expenses are ₹${formatCurrency(
        financialState.essentialExpenses
      )} today, which is ${Math.round(
        (financialState.essentialExpenses / financialState.todayIncome) * 100
      )}% of your income. This leaves ₹${formatCurrency(
        financialState.remainingMoney
      )} as remaining money to work with.`;
    }

    // Default response
    return `I can help you with:\n• Safe-to-Save calculations\n• Affordability checks\n• Emergency buffer status\n• Income analysis\n• Allocation recommendations\n\nWhat would you like to know?`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Simulate typing delay
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate response
    const response = generateResponse(userMessage);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      },
    ]);

    setLoading(false);
  };

  const suggestedQuestions = [
    "Why is my Safe-to-Save ₹350?",
    "Can I afford a ₹2000 expense?",
    "How is my emergency buffer?",
    "What's my financial health score?",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, idx) => (
          <View
            key={idx}
            style={[
              styles.messageRow,
              msg.role === "user"
                ? styles.userMessageRow
                : styles.assistantMessageRow,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                msg.role === "user"
                  ? styles.userMessage
                  : styles.assistantMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.role === "user"
                    ? styles.userMessageText
                    : styles.assistantMessageText,
                ]}
              >
                {msg.content}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={[styles.messageRow, styles.assistantMessageRow]}>
            <View style={[styles.messageBubble, styles.assistantMessage]}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggested Questions (only show if no user messages yet) */}
      {messages.length === 1 && (
        <View style={styles.suggestedContainer}>
          <Text style={styles.suggestedTitle}>Try asking:</Text>
          <View style={styles.suggestedGrid}>
            {suggestedQuestions.map((q, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestedButton}
                onPress={() => {
                  setInput(q);
                  handleSendMessage();
                }}
              >
                <Text style={styles.suggestedButtonText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputArea}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything about your finances..."
            placeholderTextColor={colors.textSecondary}
            value={input}
            onChangeText={setInput}
            editable={!loading}
            multiline
            maxHeight={100}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!input.trim() || loading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendButtonText}>{loading ? "..." : "→"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  messageRow: {
    marginBottom: 12,
    flexDirection: "row",
  },
  userMessageRow: {
    justifyContent: "flex-end",
  },
  assistantMessageRow: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  assistantMessageText: {
    color: colors.textPrimary,
  },
  suggestedContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  suggestedTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  suggestedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestedButton: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestedButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  inputArea: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
