import { Component, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../api/CategoryService';

//Category DTO
interface CategoryDTO {
  id?: string;
  name: string;
  description: string;
}

@Component({
  selector: 'categoryForm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../HTML/CategoryForm.html',
  styleUrls: ['../CSS/CategoryForm.css']
})
export class CategoryForm {

  @Input() category: CategoryDTO | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() categoryCreate = new EventEmitter<void>();
  @Output() categorySaved = new EventEmitter<void>();

  //Init DTO
  public categoryDTO: CategoryDTO = {
    name: '',
    description: ''
  };

  constructor(private categoryService: CategoryService) { }

  //Check If It's an Edit Or a Creation
  ngOnChanges(changes: SimpleChanges) {
    if (this.category) {
      this.categoryDTO = { ...this.category };
    } else {
      this.categoryDTO = { name: '', description: '' };
    }
  }

  //Save Or Update Category
  saveCategory() {
    if (this.categoryDTO.id) {
      this.categoryService.updateCategory(this.categoryDTO.id, this.categoryDTO as any).subscribe({
        next: (updatedCategory) => {
          console.log('Categoria atualizada com sucesso:', updatedCategory);

          this.categorySaved.emit();
          this.closeModal.emit();
        },
        error: (err) => {
          console.error('Erro ao atualizar categoria:', err);
        }
      });
    } else {
      this.categoryService.saveCategory(this.categoryDTO as any).subscribe({
        next: (categorySave) => {
          console.log('Categoria salva com sucesso:', categorySave);

          this.categoryCreate.emit();
          this.closeModal.emit();
        },
        error: (err) => {
          console.error('Erro ao salvar categoria:', err);
        }
      });
    }
  }

  //Close Modal
  close() {
    this.closeModal.emit();
  }
}