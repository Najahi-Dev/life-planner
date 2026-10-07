import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import { Input, Chip, SegmentedControl } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { TaskFilterOptions } from '../types';
import { Priority, TaskCategory } from '@/types';

export interface TaskFilterBarProps {
  filters: TaskFilterOptions;
  onChangeFilters: (updated: Partial<TaskFilterOptions>) => void;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filters,
  onChangeFilters,
}) => {
  const theme = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <Input
        placeholder="Search tasks, tags, or notes..."
        value={filters.searchQuery || ''}
        onChangeText={(text) => onChangeFilters({ searchQuery: text })}
        leftIcon={<Search size={18} color={theme.colors.textSecondary} />}
        clearable
        onClear={() => onChangeFilters({ searchQuery: '' })}
        containerStyle={{ marginBottom: 10 }}
      />

      {/* Status Segmented Control */}
      <SegmentedControl<'all' | 'pending' | 'completed'>
        options={[
          { label: 'All Tasks', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Completed', value: 'completed' },
        ]}
        value={filters.status}
        onChange={(status) => onChangeFilters({ status })}
        style={{ marginBottom: 10 }}
      />

      {/* Category / Priority Filter Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        <Chip
          label="All Categories"
          selected={!filters.category || filters.category === 'all'}
          onPress={() => onChangeFilters({ category: 'all' })}
        />

        {(['work', 'study', 'uni', 'personal', 'health', 'finance'] as TaskCategory[]).map((c) => (
          <Chip
            key={c}
            label={c.toUpperCase()}
            variant="category"
            category={c}
            selected={filters.category === c}
            onPress={() =>
              onChangeFilters({ category: filters.category === c ? 'all' : c })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
});
